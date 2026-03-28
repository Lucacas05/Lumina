import type { APIContext } from "astro";
import { db } from "@/lib/server/db";

const selectRoomStatement = db.prepare("SELECT code FROM rooms WHERE code = ?");

const checkMembershipStatement = db.prepare(
  "SELECT 1 FROM room_members WHERE room_code = ? AND user_id = ?",
);

const findPendingInvitationStatement = db.prepare(
  "SELECT id FROM room_invitations WHERE room_code = ? AND invitee_id = ? AND status = 'pending'",
);

const acceptInvitationStatement = db.prepare(
  "UPDATE room_invitations SET status = 'accepted' WHERE id = ?",
);

const insertMemberStatement = db.prepare(
  "INSERT INTO room_members (room_code, user_id) VALUES (?, ?)",
);

export const prerender = false;

export async function POST({ locals, params }: APIContext) {
  if (!locals.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const room = selectRoomStatement.get(params.code) as { code: string } | undefined;
  if (!room) {
    return Response.json({ error: "Room not found" }, { status: 404 });
  }

  const isMember = checkMembershipStatement.get(params.code, locals.user.id);
  if (isMember) {
    return Response.json({ error: "Already a member of this room" }, { status: 409 });
  }

  const pendingInvitation = findPendingInvitationStatement.get(params.code, locals.user.id) as
    | { id: string }
    | undefined;

  const joinRoom = db.transaction(() => {
    if (pendingInvitation) {
      acceptInvitationStatement.run(pendingInvitation.id);
    }
    insertMemberStatement.run(params.code, locals.user!.id);
  });
  joinRoom();

  return Response.json({ ok: true });
}
