import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile, updateMyProfile } from "../../api/memberApi";

const initialForm = { name: "", email: "", phone: "" };

const ProfileComponent = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 내 정보 로드
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getMyProfile(); // { name, email, phone, ... }
        if (alive && data) setForm((prev) => ({ ...prev, ...data }));
      } catch (error) {
        const status = error?.response?.status;
        if (status === 401) {
          alert(
            "로그인이 만료되었거나 인증 정보가 없습니다. 다시 로그인해주세요."
          );
          navigate(`/login?redirect=${encodeURIComponent("/mypage")}`, {
            replace: true,
          });
        } else if (status === 403) {
          alert("접근 권한이 없습니다.");
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

  // 입력 변경
  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // 저장
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // 중복 제출 방지

    if (!form.name?.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      alert("유효한 이메일 형식을 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      await updateMyProfile(form);
      alert("내 정보가 저장되었습니다.");
      // 필요 시 재조회:
      // const fresh = await getMyProfile();
      // setForm(prev => ({ ...prev, ...fresh }));
    } catch (error) {
      const status = error?.response?.status;
      if (status === 401) {
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        navigate(`/login?redirect=${encodeURIComponent("/mypage")}`, {
          replace: true,
        });
      } else {
        console.error("프로필 저장 실패:", error);
        const msg =
          error?.response?.data?.message || "저장 중 오류가 발생했습니다.";
        alert(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mypage-form-wrapper controls-xl">
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="name" className="form-label">
            이름
          </label>
          <input
            id="name"
            name="name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
            placeholder="이름을 입력하세요"
            disabled={loading}
            required
            autoComplete="name"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="form-label">
            이메일
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            placeholder="example@domain.com"
            disabled={loading}
            required
            autoComplete="email"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="phone" className="form-label">
            연락처
          </label>
          <input
            id="phone"
            name="phone"
            className="form-control"
            value={form.phone}
            onChange={handleChange}
            placeholder="010-1234-5678"
            disabled={loading}
            autoComplete="tel"
            inputMode="tel"
            // pattern="^01[0-9]-?\d{3,4}-?\d{4}$"
          />
        </div>

        <div className="qna-btn-row">
          <button type="submit" className="btn btn-mz-style" disabled={loading}>
            {loading ? "저장 중..." : "저장"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileComponent;
