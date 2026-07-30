import { useTranslation } from 'react-i18next';

type AiDraftExitDialogProps = {
  visible: boolean;
  saving?: boolean;
  onContinue: () => void;
  onDiscard: () => void;
  onSaveAndExit: () => void;
};

export function AiDraftExitDialog({
  visible,
  saving = false,
  onContinue,
  onDiscard,
  onSaveAndExit,
}: AiDraftExitDialogProps) {
  const { t } = useTranslation();

  if (!visible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/75 px-6 backdrop-blur-sm"
      onClick={() => {
        if (!saving) {
          onContinue();
        }
      }}
    >
      <div
        className="flex w-full max-w-[340px] flex-col rounded-[24px] border border-[#343438] bg-[#18181b] px-6 pt-7 pb-5 shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
        onClick={event => event.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="draft-exit-title"
        aria-describedby="draft-exit-description"
      >
        <h2 id="draft-exit-title" className="text-center text-[18px] font-bold text-[#f4f4f5]">
          {t('draftExit.title')}
        </h2>
        <p
          id="draft-exit-description"
          className="mt-3 text-center text-[13px]/5 text-[#8b8b92]"
        >
          {t('draftExit.description')}
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            className="h-11 flex-1 rounded-full border border-[#3b3b40] bg-[#252529] text-[14px] font-medium text-[#c7c7cc] active:bg-[#303035] disabled:opacity-50"
            disabled={saving}
            onClick={onDiscard}
          >
            {t('draftExit.discard')}
          </button>
          <button
            type="button"
            className="h-11 flex-1 rounded-full border border-brand-green/70 bg-brand-green/10 text-[14px] font-bold text-brand-green active:bg-brand-green/20 disabled:opacity-60"
            disabled={saving}
            onClick={onSaveAndExit}
          >
            {saving ? t('draftExit.saving') : t('draftExit.saveAndExit')}
          </button>
        </div>
      </div>
    </div>
  );
}
