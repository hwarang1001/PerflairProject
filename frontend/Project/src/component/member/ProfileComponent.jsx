// src/component/member/ProfileComponent.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile, changePassword } from "../../api/memberApi";

const initialForm = {
  name: "",
  email: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function ProfileComponent() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  // 프로필 로드: 이름/이메일만 조회용으로 채움
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const d = await getMyProfile(); // { name / realName, email ... }
        if (!alive) return;
        setForm((prev) => ({
          ...prev,
          name: d?.realName || d?.name || "",
          email: d?.email ?? d?.userId ?? "",
        }));
        setUserId(d?.userId || "");
      } catch (error) {
        const status = error?.response?.status;
        if (status === 401) {
          alert("로그인이 필요합니다. 다시 로그인해주세요.");
          navigate(`/login?redirect=${encodeURIComponent("/mypage")}`, {
            replace: true,
          });
        } else {
          console.error("프로필 불러오기 실패:", error);
          alert("프로필 정보를 불러오는 중 오류가 발생했습니다.");
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [navigate]);

  // 비밀번호 정책 (기존 PasswordComponent와 동일 규칙)
  const pwPolicyOk =
    form.newPassword.length >= 8 &&
    /[a-z]/.test(form.newPassword) &&
    /[0-9]/.test(form.newPassword);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const clearAuthTokens = () => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
      // 필요하면 추가로 비우기
      // localStorage.removeItem("login");
    } catch {}
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!form.currentPassword) {
      alert("현재 비밀번호를 입력하세요.");
      return;
    }
    if (!pwPolicyOk) {
      alert("새 비밀번호는 8자 이상 알파벳, 숫자를 포함해야 합니다.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      alert("새 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    try {
      // 백엔드가 현재 비번 검증 + 변경을 처리
      await changePassword(userId, {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      alert("비밀번호가 변경되었습니다. 다시 로그인 해주세요.");
      // 폼 정리
      setForm((f) => ({
        ...f,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      // 토큰 정리 후 로그인 화면으로
      clearAuthTokens();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("비밀번호 변경 실패:", error);
      const msg =
        error?.response?.data?.message ||
        "변경 중 오류가 발생했습니다. 현재 비밀번호를 다시 입력해 주세요.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mypage-form-wrapper controls-xl">
      <form onSubmit={onSubmit} noValidate>
        {/* 읽기 전용 정보 */}
        <div className="mb-4">
          <label htmlFor="name" className="form-label">
            이름
          </label>
          <input
            id="name"
            name="name"
            className="form-control"
            value={form.name}
            disabled
            readOnly
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="form-label">
            이메일
          </label>
          <input
            id="email"
            name="email"
            className="form-control"
            value={form.email}
            disabled
            readOnly
          />
          <small className="text-muted">
            이메일/이름 변경은 고객센터로 문의해주세요.
          </small>
        </div>

        {/* 비밀번호 변경 섹션 */}
        <hr className="myhub-sep" />

        <div className="mb-4">
          <label htmlFor="curPw" className="form-label">
            현재 비밀번호
          </label>
          <input
            id="curPw"
            type="password"
            name="currentPassword"
            className="form-control"
            value={form.currentPassword}
            onChange={onChange}
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
            name="newPassword"
            className="form-control"
            value={form.newPassword}
            onChange={onChange}
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
            8자 이상 알파벳, 숫자 포함
          </small>
        </div>

        <div className="mb-5">
          <label htmlFor="confirmPw" className="form-label">
            새 비밀번호 확인
          </label>
          <input
            id="confirmPw"
            type="password"
            name="confirmPassword"
            className="form-control"
            value={form.confirmPassword}
            onChange={onChange}
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
}
