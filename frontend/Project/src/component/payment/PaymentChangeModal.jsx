import { useState } from "react";
import { setDefaultAddress } from "../../api/addressApi";

export default function PaymentEditModal({
  open,
  addressList,
  onClose,
  onSave,
}) {
  const [loading, setLoading] = useState(false);

  if (!open) {
    return null;
  }

  // addressList가 배열인지 확인
  const hasMultiple = Array.isArray(addressList) && addressList.length > 1;

  const onSelectDefault = async (id) => {
    setLoading(true);
    try {
      await setDefaultAddress(id);
      // addressList가 배열일 경우에만 map() 호출
      if (Array.isArray(addressList)) {
        const updatedAddressList = addressList.map((a) => ({
          ...a,
          default: a.id === id,
        }));
        // onSave를 통해 상위 컴포넌트로 업데이트된 주소 전달
        onSave(updatedAddressList);
      }
      // 기본 배송지 지정 후 모달 닫기
      onClose();
    } catch (e) {
      console.error(e);
      alert("기본 배송지 지정 실패");
    } finally {
      setLoading(false);
    }
  };

  // 모달 닫을 때 상태 업데이트
  const handleClose = () => {
    onClose(); // 부모 컴포넌트에서 모달 닫기
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100"
      style={{ background: "rgba(0,0,0,.35)", zIndex: 1050 }}
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-3 p-4"
        style={{ width: 640, maxWidth: "92%", margin: "8vh auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h4 className="text-center fw-semibold mb-3">배송지 목록</h4>
        <hr
          className="my-3 border-top"
          style={{ borderTopColor: "#e5e5e5", opacity: 1 }}
        />

        {/* 주소 리스트 */}
        <div className="mb-3">
          <div className="text-muted small">주소 목록</div>
          <div className="list-group">
            {Array.isArray(addressList) && addressList.length === 0 ? (
              <div className="text-muted py-3">등록된 배송지가 없습니다.</div>
            ) : (
              <ul className="list-unstyled d-flex flex-column gap-3 mb-4">
                {Array.isArray(addressList) &&
                  addressList.map((addr) => (
                    <li key={addr.id} className="p-3 rounded-3 panel-elev">
                      {hasMultiple && (
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <input
                            type="radio"
                            name="defaultAddr"
                            checked={addr.default === true}
                            onChange={() => onSelectDefault(addr.id)} // 기본 배송지 선택 시
                          />
                          <span className="small text-muted">
                            현재 배송지로 지정
                          </span>
                        </div>
                      )}

                      <div className="d-flex justify-content-between flex-wrap gap-2">
                        <div>
                          <div className="fw-semibold">
                            {addr.receiverName}{" "}
                            {addr.default && (
                              <span className="badge text-bg-dark ms-2">
                                현재 배송지
                              </span>
                            )}
                          </div>
                          <div className="text-muted">{addr.phone}</div>
                        </div>
                      </div>

                      <div className="mt-2 small text-muted">
                        ({addr.zonecode}) {addr.address} {addr.detailAddress}
                        {addr.memo && <> · 메모: {addr.memo}</>}
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
