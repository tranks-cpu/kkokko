import { Button } from '../ui/Button';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RulesModal({ isOpen, onClose }: RulesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60">
      <div className="bg-stone-800 rounded-t-2xl w-full max-w-lg p-5 pb-8 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-amber-400">게임 규칙</h3>
          <button
            onClick={onClose}
            className="text-stone-400 text-2xl leading-none p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-sm text-stone-300 leading-relaxed">
          <section>
            <h4 className="text-amber-400 font-bold mb-1">구성물</h4>
            <p>주사위 8개 (1, 2, 3, 4, 5, 🐛)</p>
            <p>타일 16개 (21~36번, 각 타일에 벌레 1~4마리)</p>
          </section>

          <section>
            <h4 className="text-amber-400 font-bold mb-1">목표</h4>
            <p>타일을 모아 벌레를 가장 많이 획득하면 승리!</p>
          </section>

          <section>
            <h4 className="text-amber-400 font-bold mb-1">턴 진행</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>주사위를 전부 굴린다</li>
              <li>나온 눈금 중 <strong className="text-stone-100">하나를 골라</strong> 해당 눈금의 주사위를 모두 확보</li>
              <li>이미 선택한 눈금은 다시 선택 불가</li>
              <li>남은 주사위로 다시 굴리거나, 타일을 가져올 수 있음</li>
            </ol>
          </section>

          <section>
            <h4 className="text-amber-400 font-bold mb-1">타일 획득</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>확보한 주사위 합계 이하인 중앙 타일을 가져감</li>
              <li><strong className="text-stone-100">반드시 🐛을 1개 이상</strong> 확보해야 타일 획득 가능</li>
              <li>🐛 = 5점으로 합계에 포함</li>
            </ul>
          </section>

          <section>
            <h4 className="text-amber-400 font-bold mb-1">훔치기</h4>
            <p>확보 합계와 <strong className="text-stone-100">정확히 같은 값</strong>의 타일이 다른 플레이어 맨 위에 있으면 훔칠 수 있음</p>
          </section>

          <section>
            <h4 className="text-amber-400 font-bold mb-1">버스트 (실패)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>선택 가능한 눈금이 없으면 버스트</li>
              <li>자신의 타일 맨 위 1장을 중앙에 반납</li>
              <li>중앙에서 가장 높은 타일 1장을 영구 제거</li>
            </ul>
          </section>

          <section>
            <h4 className="text-amber-400 font-bold mb-1">게임 종료</h4>
            <p>중앙 타일이 모두 없어지면 종료. 벌레가 가장 많은 플레이어 승리! (동점 시 타일 수로 판정)</p>
          </section>
        </div>

        <div className="mt-5">
          <Button onClick={onClose} fullWidth>
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
}
