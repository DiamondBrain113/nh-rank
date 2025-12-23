import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { User } from "@/models";
import dbConnect from "@/lib/mongoose";
import {
  createAccessToken,
  createRefreshToken,
  setTokenCookies,
} from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    await dbConnect();

    const user = await User.findOne({ username }).lean();
    if (!user)
      return NextResponse.json(
        { ok: false, error: "Tên người dùng không hợp lệ" },
        { status: 406 }
      );
    const ok = bcrypt.compare(password, user.password!);
    if (!ok)
      return NextResponse.json(
        { ok: false, error: "Sai mật khẩu!" },
        { status: 406 }
      );

    const payload = { id: user._id!.toString(), role: user.role };
    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);

    let res: NextResponse = NextResponse.json({ ok: true });
    res = setTokenCookies(res, accessToken, refreshToken);

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Đăng nhập thất bại: "+err },
      { status: 500 }
    );
  }
}
