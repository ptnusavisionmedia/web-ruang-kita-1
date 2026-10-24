import { NextResponse } from "next/server";

// Tidak ada akun/sesi: tidak ada yang perlu diproses.
export function proxy() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
