// src/components/mypage/PasswordComponent.jsx
import React, { useState } from "react";
import { changePassword } from "../../api/memberApi";

const PasswordComponent = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (setter) => (e) => setter(e.target.value);

  const pwPolicyOk =
    newPassword.length >= 8 &&
    /[A-Z]/.test(newPassword) &&
    /[a-z]/.test(newPassword) &&
    /[0-9]/.test(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!currentPassword) {
      alert("현재 비밀번호를 입력해주세요.");
      return;
    }
    if (!pwPolicyOk) {
      alert("비밀번호는 8자 이상, 대/소문자, 숫자를 포함해야 합니다.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("새 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    try {
      await changePassword({ currentPassword, newPassword });
      alert("비밀번호가 변경되었습니다.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("비밀번호 변경 실패:", error);
      const msg =
        error?.response?.data?.message || "변경 중 오류가 발생했습니다.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mypage-form-wrapper controls-xl">
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="curPw" className="form-label">
            현재 비밀번호
          </label>
          <input
            id="curPw"
            type="password"
            className="form-control"
            value={currentPassword}
            onChange={handleChange(setCurrentPassword)}
            placeholder="현재 비밀번호"
            disabled={loading}
            required
            autoComplete="current-password"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="newPw" className="form-label">
            새 비밀번호
          </label>
          <input
            id="newPw"
            type="password"
            className="form-control"
            value={newPassword}
            onChange={handleChange(setNewPassword)}
            placeholder="새 비밀번호"
            disabled={loading}
            required
            autoComplete="new-password"
          />
          <small
            className={`form-text ${
              pwPolicyOk ? "text-success" : "text-muted"
            }`}
          >
            8자 이상, 대/소문자, 숫자 포함
          </small>
        </div>

        <div className="mb-5">
          <label htmlFor="confirmPw" className="form-label">
            새 비밀번호 확인
          </label>
          <input
            id="confirmPw"
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={handleChange(setConfirmPassword)}
            placeholder="새 비밀번호 확인"
            disabled={loading}
            required
            autoComplete="new-password"
          />
        </div>

        <div className="qna-btn-row">
          <button type="submit" className="btn btn-mz-style" disabled={loading}>
            {loading ? "변경 중..." : "비밀번호 변경"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordComponent;
