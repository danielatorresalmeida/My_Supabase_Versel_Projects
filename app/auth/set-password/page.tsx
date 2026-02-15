import { redirect } from "next/navigation";

export default function LegacySetPasswordPage() {
  redirect("/reset-password/update");
}
