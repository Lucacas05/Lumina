import type { APIContext } from "astro";
import { db } from "@/lib/server/db";

const deleteFriendshipStatement = db.prepare(
  "DELETE FROM friendships WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)",
);

export const prerender = false;

export async function DELETE({ locals, params }: APIContext) {
  if (!locals.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const friendId = params.friendId;
  if (!friendId) {
    return Response.json({ error: "Friend ID is required" }, { status: 400 });
  }

  const result = deleteFriendshipStatement.run(
    locals.user.id,
    friendId,
    friendId,
    locals.user.id,
  );

  if (result.changes === 0) {
    return Response.json({ error: "Friendship not found" }, { status: 404 });
  }

  return Response.json({ ok: true });
}
