import usermodule from "../module/usermodule.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult, body } from "express-validator";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const objError = validationResult(req);
    if (objError.errors.length > 0) {
      return res.status(400).json({ message: objError.errors, success: false });
    }
    const isUserExist = await usermodule.findOne({ email });
    if (!isUserExist) {
      return res.status(404).json({ message: "user not found", success: false });
    }
    const match = await bcrypt.compare(password, isUserExist.password);
    if (!match) {
      return res.status(401).json({ message: "wrong password", success: false });
    }
    const token = jwt.sign({ id: isUserExist._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
    const refreshToken = jwt.sign({ id: isUserExist._id }, process.env.REFRESH_TOKEN, { expiresIn: "30d" });

    res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "none", secure: true, maxAge: 86400000 * 30, path: "/" });
    res.status(200).json({ token: token, message: "correct login", success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message, success: false });
  }
};
const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const objError = validationResult(req);
    if (objError.errors.length > 0) {
      return res.status(400).json({ message: objError.errors, success: false });
    }
    const isEmailExist = await usermodule.findOne({ email: email });
    if (isEmailExist) {
      return res.status(400).json({ success: false, message: "this email is exist" });
    }
    const newuser = await usermodule.create({ name, email, password });
    const token = jwt.sign({ id: newuser._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
    const refreshToken = jwt.sign({ id: newuser._id }, process.env.REFRESH_TOKEN, { expiresIn: "30d" });

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: newuser.email,
      subject: "مرحبا بك في تطبيقنا نتمني تجربه جيده",
      html: `<h1>مرحبا بك يا ${newuser.name}</h1><p>اهلاا بك في نظامنا</p>`,
    });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "none", secure: true, maxAge: 86400000 * 30, path: "/" });
    res.status(201).json({ token: token, message: "correct signup", success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message, success: false });
  }
};
const logOut = async (req, res) => {
  try {
    const cookies1 = req.cookies.refreshToken;
    if (!cookies1) {
      return res.status(204).json({ message: "Unauthorized", success: false });
    }
    res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "none", path: "/" });
    res.status(200).json({ message: "logout successfuly", success: true });
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};
const refresh = async (req, res) => {
  const cookies = req.cookies.refreshToken;
  if (!cookies) {
    return res.status(403).json({ message: "Unauthorized", success: false });
  }
  try {
    const decoded = jwt.verify(cookies, process.env.REFRESH_TOKEN);
    const user = await usermodule.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "no user", success: false });
    }
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
    res.status(200).json({ token: accessToken, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message, success: false });
  }
};

// جلب بيانات المستخدم الحالي
const getUserProfile = async (req, res) => {
  try {
    const user = await usermodule.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "user not found", success: false });
    }
    res.status(200).json({ user, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message, success: false });
  }
};

// تحديث بيانات المستخدم
const updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "يرجى ملء جميع الحقول", success: false });
    }

    // التحقق من عدم استخدام الإيميل من قبل مستخدم آخر
    const existingUser = await usermodule.findOne({ email, _id: { $ne: req.user._id } });
    if (existingUser) {
      return res.status(400).json({ message: "هذا الإيميل مستخدم بالفعل", success: false });
    }

    const updatedUser = await usermodule
      .findByIdAndUpdate(req.user._id, { name, email }, { new: true })
      .select("-password");

    res.status(200).json({ user: updatedUser, message: "تم تحديث البيانات بنجاح", success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message, success: false });
  }
};

// تغيير كلمة المرور
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "يرجى ملء جميع الحقول", success: false });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array(), success: false });
    }

    const user = await usermodule.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "المستخدم غير موجود", success: false });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "كلمة المرور الحالية غير صحيحة", success: false });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({ message: "كلمة المرور الجديدة يجب أن تكون مختلفة", success: false });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "تم تغيير كلمة المرور بنجاح", success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message, success: false });
  }
};

// نسيان كلمة المرور - إرسال بريد تغيير كلمة المرور
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "البريد الإلكتروني مطلوب", success: false });
    }

    const user = await usermodule.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "هذا البريد غير مسجل لدينا", success: false });
    }
    const resetToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    user.resetToken = resetToken;
    // user.resetTokenExpire = Date.now() + 3600000;
    await user.save();
    // console.log(`resetToken:${resetToken}`)
    const frontendURL = process.env.FRONTEND_URL || "https://e-commerce-fullstack-nm2o.vercel.app";
    const resetLink = `${frontendURL}/reset-password?token=${resetToken}`;
    
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: user.email,
      subject: "إعادة تعيين كلمة المرور",
      html: `
        <div style="direction: rtl; text-align: right; font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #1e7b7e; margin-bottom: 20px;">مرحباً ${user.name} 👋</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك.
            </p>
            
            <div style="background-color: #fff3cd; border-right: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p style="margin: 0; color: #856404; font-weight: bold;">⏰ هذا الرابط صالح لمدة ساعة واحدة فقط</p>
            </div>
            
            <h3 style="color: #333; margin-top: 25px;">📋 خطوات إعادة تعيين كلمة المرور:</h3>
            
            <ol style="line-height: 2; color: #555;">
              <li>انسخ الرابط أدناه بالكامل</li>
              <li>افتح متصفح</li>
              <li>الصق الرابط في شريط العنوان</li>
            </ol>
            
            <div style="background-color: #e8f5e9; padding: 20px; border-radius: 8px; margin: 25px 0; border: 2px dashed #4caf50;">
              <p style="margin: 0 0 10px 0; color: #2e7d32; font-weight: bold; font-size: 14px;">🔗 رابط إعادة التعيين:</p>
              <p style="margin: 0; word-break: break-all; font-family: monospace; font-size: 13px; color: #1565c0; background-color: white; padding: 15px; border-radius: 5px; border: 1px solid #90caf9;">
                ${resetLink}
              </p>
            </div>
            
            <p style="color: #999; font-size: 12px; line-height: 1.5;">
              ⚠️ إذا لم تطلب إعادة تعيين كلمة المرور، يرجى حذف هذا البريد وتجاهله. حسابك آمن ولن يتم إجراء أي تغيير.
            </p>
            
            <p style="color: #999; font-size: 12px; margin-top: 15px;">
              🔒 لأمان حسابك، لا تشارك هذا الرابط مع أي شخص.
            </p>
          </div>
        </div>
      `,
    });
    res.status(200).json({
      message: "تم إرسال رابط تغيير كلمة المرور إلى بريدك الإلكتروني",
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message, success: false });
  }
};


const resetPassword = async (req, res) => {
  const { newPassword, token } = req.body;
  try {
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: "البيانات المطلوبة مفقودة" });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array(), success: false });
    }

    const user = await usermodule.findOne({ resetToken: token });
    if (!user) {
      return res.status(404).json({ success: false, message: "هذا الرابط غير صالح أو تم استخدامه من قبل" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log(decoded);
    } catch (jwtError) {
     user.resetToken = '';
      await user.save();
      
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({ success: false, message: "انتهت صلاحية الرابط. يرجى طلب رابط جديد" });
      }
      return res.status(401).json({ success: false, message: "الرابط غير صالح" });
    }
    user.password = newPassword;
    user.resetToken = ''; 
    await user.save();

    res.status(200).json({ message: "تم تغيير كلمة المرور بنجاح", success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message, success: false });
  }
};
export {
  loginUser,
  register,
  logOut,
  refresh,
  getUserProfile,
  updateUserProfile,
  changePassword,
  forgotPassword,
  resetPassword,
};
