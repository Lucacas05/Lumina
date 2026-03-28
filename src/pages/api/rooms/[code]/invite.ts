import type { APIContext } from "astro";
import { db } from "@/lib/server/db";

const selectRoomStatement = db.prepare("SELECT code FROM rooms WHERE code = ?");

const checkMembershipStatement = db.prepare(
  "SELECT 1 FROM room_members WHERE room_code = ? AND user_id = ?",
);

const findUserStatement = db.prepare("SELECT id FROM users WHERE id = ?");

const findPendingInvitationStatement = db.prepare(
  "SELECT id FROM room_invitations WHERE room_code = ? AND invitee_id = ? AND status = 'pending'",
);

const insertInvitationStatement = db.prepare(
  "INSERT INTO room_invitations (id, room_code, inviter_id, invitee_id, status) VALUES (?, ?, ?, ?, 'pending')",
);

export const prerender = false;

export async function POST({ locals, params, request }: APIContext) {
  if (!locals.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { userId?: string } | null;
  if (!body?.userId) {
    return Response.json({ error: "userId is required" }, { status: 400 });
  }

  const room = selectRoomStatement.get(params.code) as { code: string } | undefined;
  if (!room) {
    return Response.json({ error: "Room not found" }, { status: 404 });
  }

  const isMember = checkMembershipStatement.get(params.code, locals.user.id);
  if (!isMember) {
    return Response.json({ error: "Not a member of this room" }, { status: 403 });
  }

  const targetUser = findUserStatement.get(body.userId) as { id: string } | undefined;
  if (!targetUser) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const isTargetMember = checkMembershipStatement.get(params.code, body.userId);
  if (isTargetMember) {
    return Response.json({ error: "User is already a member" }, { status: 409 });
  }

  const existingInvitation = findPendingInvitationStatement.get(params.code, body.userId) as
    | { id: string }
    | undefined;
  if (existingInvitation) {
    return Response.json({ error: "Invitation already pending" }, { status: 409 });
  }

  const id = crypto.randomUUID();
  insertInvitationStatement.run(id, params.code, locals.user.id, body.userId);

  return Response.json({
    invitation: {
      id,
      roomCode: params.code,
      inviterId: locals.user.id,
      inviteeId: body.userId,
      status: "pending",
      createdAt: new Date().toISOString(),
    },
  });
}
