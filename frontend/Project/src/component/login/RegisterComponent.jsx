import React, { useState } from "react";
import DaumPostcode from "react-daum-postcode";
import "./RegisterComponent.css";

const initialForm = {
  email: "",
  realName: "",
  password: "",
  confirmPassword: "",
  zonecode: "", // 우편번호
  address: "", // 기본 주소 (API에서 자동입력)
  detailAddress: "", // 상세 주소 (직접 입력)
};

const RegisterComponent = () => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [showPostcode, setShowPostcode] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddressComplete = (data) => {
    setForm({
      ...form,
      zonecode: data.zonecode,
      address: data.address,
    });
    setShowPostcode(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const {
      email,
      realName,
      password,
      confirmPassword,
      zonecode,
      address,
      detailAddress,
    } = form;

    if (
      !email ||
      !realName ||
      !password ||
      !confirmPassword ||
      !zonecode ||
      !address ||
      !detailAddress
    ) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setError("");
    console.log("회원가입 정보:", form);
    alert("회원가입 요청 완료 (백엔드 연동 예정)");
    setForm(initialForm);
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>회원가입</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="realName"
            placeholder="이름"
            value={form.realName}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="비밀번호 확인"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          {/* 우편번호 + 주소 + 상세주소 */}
          <div className="address-group">
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                name="zonecode"
                value={form.zonecode}
                readOnly
                className="address-input"
              />
              <button
                type="button"
                onClick={() => setShowPostcode(true)}
                className="address-button"
              >
                주소 찾기
              </button>
            </div>

            <input
              type="text"
              name="address"
              value={form.address}
              readOnly
              className="address-input"
            />

            <input
              type="text"
              name="detailAddress"
              placeholder="상세 주소"
              value={form.detailAddress}
              onChange={handleChange}
              className="address-input"
            />
          </div>

          <button type="submit">회원가입</button>
          {error && <p className="register-error">{error}</p>}
        </form>

        {showPostcode && (
          <div className="modal-overlay" onClick={() => setShowPostcode(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button
                className="modal-close-button"
                onClick={() => setShowPostcode(false)}
              >
                &times;
              </button>
              <DaumPostcode onComplete={handleAddressComplete} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterComponent;
