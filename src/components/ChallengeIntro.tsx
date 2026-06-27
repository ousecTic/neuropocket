import Network from 'lucide-react/dist/esm/icons/network';
import Target from 'lucide-react/dist/esm/icons/target';
import { useTranslation } from 'react-i18next';

interface ChallengeIntroProps {
  onDismiss: () => void;
}

export function ChallengeIntro({ onDismiss }: ChallengeIntroProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-start gap-6">
          <div className="bg-primary/10 rounded-full p-3 flex-shrink-0">
            <Network className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">{t('challengeIntro.title')}</h2>

            <div className="space-y-4 text-gray-600">
              <p>
                {t('challengeIntro.description')}
              </p>

              <div className="flex items-start gap-2 text-gray-700 bg-gray-50 p-4 rounded-lg">
                <Target className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">{t('challengeIntro.goalLabel')}</p>
                  <p className="text-sm">{t('challengeIntro.goal')}</p>
                </div>
              </div>

              <div className="space-y-2">
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>{t('challengeIntro.step1')}</li>
                  <li>{t('challengeIntro.step2')}</li>
                  <li>{t('challengeIntro.step3')}</li>
                </ol>
              </div>
            </div>

            <button
              onClick={onDismiss}
              className="mt-6 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              {t('challengeIntro.start')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
