import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import PaymentChangeModal from "./PaymentChangeModal.jsx";
import { API_SERVER_HOST } from "../../api/cartApi.jsx";
import { paymentPost } from "../../api/paymentApi.jsx";
import { useSelector } from "react-redux";
import { getMyAddresses, updateAddress } from "../../api/addressApi.jsx";
/* 숫자 포맷터 */
const C = (n) => (Number(n) || 0).toLocaleString("ko-KR");

const initState = [
  {
    id: 0,
    receiverName: "",
    phone: "",
    zonecode: "",
    address: "",
    detailAddress: "",
    memo: "",
    default: false,
  },
];

export default function PaymentComponent() {
  const { state } = useLocation(); // Cart에서 넘어온 { items, from }
  console.log(state?.items);
  const [items, setItems] = useState([]);
  const [address, setAddress] = useState(initState);
  const [addrOpen, setAddrOpen] = useState(false);
  const loginState = useSelector((s) => s.login);
  const userId = loginState?.userId;
  const [reqType, setReqType] = useState("none"); // none | door | guard | custom
  const [reqText, setReqText] = useState("");
  const [doorPw, setDoorPw] = useState("");
  const [memo, setMemo] = useState(""); // memo

  // 기본배송지 를 찾음 (존재하지 않으면 배열에 첫번째 값사용)
  const defaultAddress =
    address.find((addr) => addr.default === true) || initState[0];

  // 장바구니 && 상세페이지에서 받아온 데이터 저장
  useEffect(() => {
    if (Array.isArray(state?.items) && state.items.length) {
      setItems(state.items); // Cart에서 전달된 상품 정보를 items 상태에 저장
      window.scrollTo(0, 0);
    }
  }, [state?.items]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const addresses = await getMyAddresses();
        setAddress(addresses || initState); // 받은 주소로 상태 업데이트
      } catch (error) {
        console.error("주소 가져오기 오류:", error);
        setAddress(initState); // 오류 발생 시 기본값 설정
      }
    };
    fetchAddresses(); // 컴포넌트 로드 시 한 번만 호출
  }, []); // 의존성 배열을 빈 배열로 변경

  // 주소 상태 업데이트
  const handleAddressSave = (updatedAddresses) => {
    setAddress(updatedAddresses); // 주소 업데이트
  };

  useEffect(() => {
    // 주소가 변경된 후 UI에 반영되는지 확인
    console.log("주소가 변경되었습니다:", address);
  }, [address]); // address가 변경될 때마다 실행

  useEffect(() => {
    if (defaultAddress?.memo) {
      let updatedMemo = defaultAddress.memo; // 기본값으로 가져온 메모값

      // "문 앞에 놓아주세요" 처리
      if (defaultAddress.memo.startsWith("문 앞에 놓아주세요")) {
        // 비밀번호가 있을 경우 (괄호 안에 비밀번호가 포함되어 있을 경우)
        if (
          defaultAddress.memo.includes("(") &&
          defaultAddress.memo.includes(")")
        ) {
          setReqType("door"); // 비밀번호가 포함되면 door로 설정
        } else {
          setReqType("door"); // 비밀번호가 없으면 door로 설정
        }
      }
      // "직접 입력" 처리
      else if (
        defaultAddress.memo !== "요청사항 없음" &&
        defaultAddress.memo !== "경비실에 맡겨주세요"
      ) {
        setReqType("custom"); // 사용자가 입력한 다른 요청사항은 custom으로 설정
      }
      // "경비실에 맡겨주세요"
      else if (defaultAddress.memo === "경비실에 맡겨주세요") {
        setReqType("guard");
      }
      // "요청사항 없음"
      else if (
        defaultAddress.memo === "요청사항 없음" ||
        defaultAddress.memo === "" ||
        defaultAddress.memo === null
      ) {
        setReqType("none");
      }

      // 메모 업데이트
      setMemo(updatedMemo);
    }
  }, [address]); // address가 변경될 때마다 실행

  useEffect(() => {
    let updatedMemo = "";

    // 요청사항 타입에 따른 메모 업데이트
    if (reqType === "door") {
      updatedMemo = "문 앞에 놓아주세요"; // 기본 메모 설정
      if (doorPw.trim()) {
        updatedMemo = `문 앞에 놓아주세요 (${doorPw.trim()})`; // 비밀번호가 있으면 추가
      }
    } else if (reqType === "custom" && reqText.trim()) {
      updatedMemo = reqText.trim();
    } else if (reqType === "guard") {
      updatedMemo = "경비실에 맡겨주세요";
    } else if (reqType === "none") {
      updatedMemo = "요청사항 없음"; // "none"일 때만 "요청사항 없음"으로 설정
    }

    // 메모 상태가 업데이트되어야 할 때만 업데이트
    if (updatedMemo !== memo) {
      setMemo(updatedMemo);
      updateRequestMemo(updatedMemo); // 서버로 메모 업데이트
    }
  }, [reqType, reqText, doorPw, memo]);

  // 요청사항을 DB에 업데이트하는 함수
  const updateRequestMemo = async (updatedMemo) => {
    try {
      const updatedAddress = { ...defaultAddress, memo: updatedMemo };
      const updated = await updateAddress(updatedAddress.id, updatedAddress); // 서버로 업데이트
      setAddress(
        address.map((addr) =>
          addr.id === updatedAddress.id ? updatedAddress : addr
        )
      ); // 로컬 상태 업데이트
    } catch (error) {
      console.error("메모 업데이트 실패:", error);
    }
  };

  const summary = useMemo(() => {
    // 장바구니 아이템의 총합 계산
    const subtotal = items.reduce(
      (s, it) => s + (it.price || 0) * (it.qty || 1),
      0
    );
    // 배송비는 무료로 설정
    const shipping = 0;
    // 최종 계산된 총액 (subtotal + shipping)
    return { subtotal, shipping, total: subtotal + shipping };
  }, [items]); // 'items' 배열이 변경될 때마다 다시 계산

  // 결제하기 함수
  const handlePayment = async () => {
    // 주문 데이터 구성
    const paymentData = {
      userId: userId,
      cinoList: items.map((it) => it.cino), // 결제할 상품 Cino 리스트
      payMethod: "kakaopay", // 결제 방법 (카카오페이 등)
      shippingAddressId: address[0]?.id || 1, // 기본배송지 ID를 사용
    };
    console.log(paymentData);

    try {
      await paymentPost(paymentData); // API 호출
      alert("결제가 완료되었습니다!");
      // 결제 완료 후 처리할 코드 (예: 결제 완료 페이지로 이동)
    } catch (error) {
      console.error("결제 처리 오류:", error);
      alert("결제 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <section className="py-5">
      <div className="container px-4 px-lg-5 w-75">
        <div className="mb-5">
          <h1 className="text-center mb-5">주문 & 결제</h1>
          <hr />
        </div>

        {/* 주문상품 */}
        <section className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="fw-semibold">주문상품</div>
            <div className="text-muted small">{items.length}건</div>
          </div>
          <div className="border rounded-3 p-3">
            {items.map((it) => (
              <div
                key={it.cino} // cino 또는 productId 사용
                className="d-flex align-items-center justify-content-between py-2"
              >
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={
                      it.imageFile?.length > 0
                        ? `${API_SERVER_HOST}/api/product/view/${it.imageFile}`
                        : "https://dummyimage.com/400x300/dee2e6/6c757d.jpg"
                    }
                    alt={it.pname}
                    style={{
                      width: 56,
                      height: 56,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                  <div>
                    <div className="fw-normal">{it.pname}</div>
                    <div className="text-muted small">{it.perfumeVol} ml</div>
                  </div>
                </div>
                <div className="text-end" style={{ minWidth: 140 }}>
                  <div className="text-muted small">수량 {it.qty || 1}</div>
                  <div className="fw-semibold">
                    {C((it.price || 0) * (it.qty || 1))}원
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 배송정보 */}
        <section className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="fw-semibold">배송정보</div>
          </div>
          <div className="border rounded-3 p-3">
            {/* default: true인 주소만 보여주기 */}
            <div key={defaultAddress.id}>
              <span className="badge text-bg-light border me-2 fw-normal">
                기본배송지
              </span>
              <div className="row g-2 mt-2">
                <div className="col-12 col-md-6">
                  <div className="text-muted small">받는 분</div>
                  <div className="fw-semibold">
                    {defaultAddress.receiverName || "수취인 정보 없음"}
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="text-muted small">휴대폰 번호</div>
                  <div className="fw-semibold">
                    {defaultAddress.phone || "전화번호 정보 없음"}
                  </div>
                </div>
                <div className="col-12">
                  <div className="text-muted small">주소</div>
                  <div className="d-flex justify-content-between">
                    <div className="fw-semibold">
                      {defaultAddress.zonecode || ""}{" "}
                      {defaultAddress.address || ""}{" "}
                      {defaultAddress.detailAddress || ""}
                    </div>
                    <button
                      className="btn btn-sm btn-dark"
                      onClick={() => setAddrOpen(true)} // 주소 수정 모달 열기
                    >
                      주소 수정
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 요청사항 */}
        <section className="mb-4">
          <div className="fw-semibold mb-2">배송 요청사항</div>
          <div className="border rounded-3 p-3">
            <div className="vstack gap-2">
              {[
                { key: "none", label: "요청사항 없음" },
                { key: "door", label: "문 앞에 놓아주세요" },
                { key: "guard", label: "경비실에 맡겨주세요" },
                { key: "custom", label: "직접 입력" },
              ].map((opt) => (
                <label key={opt.key} className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="req"
                    checked={reqType === opt.key}
                    onChange={() => setReqType(opt.key)}
                  />
                  <span className="form-check-label ms-1">{opt.label}</span>
                </label>
              ))}
              {reqType === "custom" && (
                <input
                  className="form-control"
                  placeholder="요청사항을 입력하세요"
                  value={reqText}
                  onChange={(e) => setReqText(e.target.value)}
                />
              )}
              {reqType === "door" && (
                <input
                  className="form-control"
                  placeholder="공동현관 비밀번호(선택)"
                  value={doorPw}
                  onChange={(e) => setDoorPw(e.target.value)}
                />
              )}
            </div>
            <div className="text-muted small mt-2">
              요청 메모 미리보기: {memo}
            </div>
          </div>
        </section>

        {/* 결제금액 */}
        <section className="mb-4">
          <div className="fw-semibold mb-2">결제금액</div>
          <div className="border rounded-3 p-3">
            <div className="d-flex justify-content-between py-1">
              <span className="text-muted">주문금액</span>
              <span className="fw-normal">{C(summary.subtotal)}원</span>
            </div>
            <div className="d-flex justify-content-between py-1">
              <span className="text-muted">배송비</span>
              <span className="fw-normal">무료</span>
            </div>
            <hr className="my-3" />
            <div className="d-flex justify-content-between">
              <strong className="fw-semibold">최종 결제 금액</strong>
              <strong className="fw-semibold">{C(summary.total)}원</strong>
            </div>
          </div>
        </section>

        {/* 결제 버튼 */}
        <div className="text-center">
          <button className="btn btn-dark btn-lg px-5" onClick={handlePayment}>
            {C(summary.total)}원 결제하기 (카카오페이)
          </button>
        </div>

        {/* 주소 수정 모달 */}
        <PaymentChangeModal
          open={addrOpen}
          addressList={address}
          onClose={() => setAddrOpen(false)}
          onSave={handleAddressSave} // 주소 저장 함수 전달
        />
      </div>
    </section>
  );
}
