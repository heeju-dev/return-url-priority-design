type ExitContext = {
  externalReturnUrl?: string; // 외부 서비스가 지정한 이탈 복귀 주소
  isPopup: boolean; // 새 창(팝업)으로 열렸는지
  cardSystemReturnUrl?: string; // 카드/계좌 등록 시스템이 돌려준 복귀 주소
};

// 우선순위 체인으로 "지금 어디로 보내야 하는가"를 판단
const resolveExitDestination = (
  context: ExitContext,
  navigate: (url: string) => void
) => {
  // 1순위: 외부 서비스가 지정한 주소 — 가장 바깥쪽 맥락이 우선
  if (context.externalReturnUrl) {
    navigate(context.externalReturnUrl);
    return;
  }

  // 2순위: 팝업이면 그냥 닫기 — 팝업은 히스토리가 거의 없어 뒤로가기가 불안정함
  if (context.isPopup) {
    window.close();
    return;
  }

  // 3순위: 카드/계좌 등록 시스템이 돌려준 주소
  if (context.cardSystemReturnUrl) {
    navigate(context.cardSystemReturnUrl);
    return;
  }

  // 4순위: 아무 정보도 없으면 기존 방식(단순 뒤로가기)
  window.history.back();
};

// 파라미터 이름 충돌 방지: 외부에서 받은 값을 내부 전용 이름으로 즉시 변환
const captureExternalParams = (searchParams: URLSearchParams) => {
  const externalReturnUrl = searchParams.get("returnUrl");

  // 내부 인증 절차가 쓰는 이름과 겹치지 않도록, 별도 키로 저장해 이후
  // 몇 단계를 거치더라도 값이 안전하게 유지되도록 함
  return {
    internalExternalReturnUrl: externalReturnUrl,
  };
};
