import { useMLStore } from '../store/useMLStore';
import Network from 'lucide-react/dist/esm/icons/network';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import { useTranslation, Trans } from 'react-i18next';

interface TrainingStatusBannerProps {
  projectId: string;
  classes: { name: string; images: string[] }[];
  currentTab: 'data' | 'training' | 'model';
  onGoToData?: () => void;
  onGoToTraining?: () => void;
  onGoToModel?: () => void;
}

export function TrainingStatusBanner({ projectId, classes, currentTab, onGoToData, onGoToTraining, onGoToModel }: TrainingStatusBannerProps) {
  const { t } = useTranslation();
  const { isTrained, currentProjectId, hasDataChanged, trainingSnapshot, isTraining } = useMLStore();
  
  const isProjectTrained = isTrained && currentProjectId === projectId;
  const dataHasChanged = isProjectTrained && hasDataChanged(classes);
  const isCurrentlyTraining = isTraining && currentProjectId === projectId;
  
  // Data validation
  const hasMinimumClasses = classes.length >= 2;
  const allClassesHaveImages = classes.every(c => c.images.length > 0);
  const isDataReady = hasMinimumClasses && allClassesHaveImages;
  const totalImages = classes.reduce((sum, c) => sum + c.images.length, 0);
  
  // === DATA TAB MESSAGES ===
  if (currentTab === 'data') {
    // Not enough classes
    if (!hasMinimumClasses) {
      return (
        <div className="bg-gray-50 rounded-lg p-5 mb-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <Network className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">{t('statusBanner.need2GroupsTitle')}</h4>
              <p className="text-sm text-gray-700">
                {t('statusBanner.need2GroupsBody')}
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    // Not enough images
    if (!allClassesHaveImages) {
      return (
        <div className="bg-gray-50 rounded-lg p-5 mb-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <Network className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">{t('statusBanner.addImagesTitle')}</h4>
              <p className="text-sm text-gray-700">
                {t('statusBanner.addImagesBody')}
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    // Data ready but not trained
    if (!isProjectTrained) {
      return (
        <div className="bg-green-50 rounded-lg p-5 mb-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-green-900 mb-1">{t('statusBanner.dataReadyTitle')}</h4>
              <p className="text-sm text-green-700">
                {t('statusBanner.dataReadyBody', { count: totalImages, groups: classes.length })}
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    // Trained but data changed
    if (dataHasChanged) {
      return (
        <div className="bg-amber-50 rounded-lg p-5 mb-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-amber-900 mb-1">{t('statusBanner.dataChangedTitle')}</h4>
              <p className="text-sm text-amber-700">
                <Trans
                  i18nKey="statusBanner.dataChangedBody"
                  components={{
                    tab: onGoToTraining ? (
                      <button
                        onClick={onGoToTraining}
                        className="font-semibold text-amber-900 hover:text-amber-950 underline cursor-pointer"
                      />
                    ) : (
                      <span className="font-semibold" />
                    ),
                  }}
                />
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    // Trained and up-to-date
    return (
      <div className="bg-green-50 rounded-lg p-5 mb-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-green-900 mb-1">{t('statusBanner.aiReadyTitle')}</h4>
            <p className="text-sm text-green-700">
              {t('statusBanner.aiReadyBodyData', { count: trainingSnapshot?.totalImages || 0 })}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // === TRAINING TAB MESSAGES ===
  if (currentTab === 'training') {
    // Training in progress
    if (isCurrentlyTraining) {
      return (
        <div className="bg-primary/10 rounded-lg p-5 mb-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-primary-dark mb-1">{t('statusBanner.trainingTitle')}</h4>
              <p className="text-sm text-primary-dark">
                {t('statusBanner.trainingBody')}
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    // Data not ready
    if (!isDataReady) {
      return (
        <div className="bg-gray-50 rounded-lg p-5 mb-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <Network className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">{t('statusBanner.addDataTitle')}</h4>
              <p className="text-sm text-gray-700">
                <Trans
                  i18nKey="statusBanner.addDataBody"
                  components={{
                    tab: onGoToData ? (
                      <button
                        onClick={onGoToData}
                        className="font-semibold text-primary hover:text-primary-dark underline cursor-pointer"
                      />
                    ) : (
                      <span className="font-semibold" />
                    ),
                  }}
                />
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    // Data changed - needs retraining
    if (dataHasChanged) {
      return (
        <div className="bg-amber-50 rounded-lg p-5 mb-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-amber-900 mb-1">{t('statusBanner.needRetrainTitle')}</h4>
              <p className="text-sm text-amber-700">
                <Trans
                  i18nKey="statusBanner.needRetrainBodyTraining"
                  components={{ b: <span className="font-semibold text-amber-900" /> }}
                />
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    // Trained and ready
    if (isProjectTrained) {
      return (
        <div className="bg-green-50 rounded-lg p-5 mb-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-green-900 mb-1">{t('statusBanner.aiReadyTitle')}</h4>
              <p className="text-sm text-green-700">
                <Trans
                  i18nKey="statusBanner.aiReadyBodyTraining"
                  count={trainingSnapshot?.totalImages || 0}
                  components={{
                    tab: onGoToModel ? (
                      <button
                        onClick={onGoToModel}
                        className="font-semibold text-green-900 hover:text-green-950 underline cursor-pointer"
                      />
                    ) : (
                      <span className="font-semibold" />
                    ),
                  }}
                />
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    // Ready to train
    return (
      <div className="bg-gray-50 rounded-lg p-5 mb-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
            <Network className="w-6 h-6 text-gray-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">{t('statusBanner.readyToTrainTitle')}</h4>
            <p className="text-sm text-gray-700">
              {t('statusBanner.readyToTrainBody')}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // === MODEL TAB MESSAGES ===
  if (currentTab === 'model') {
    // Not trained yet
    if (!isProjectTrained) {
      return (
        <div className="bg-gray-50 rounded-lg p-5 mb-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <Network className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">{t('statusBanner.trainFirstTitle')}</h4>
              <p className="text-sm text-gray-700">
                <Trans
                  i18nKey="statusBanner.trainFirstBody"
                  components={{
                    tab: onGoToTraining ? (
                      <button
                        onClick={onGoToTraining}
                        className="font-semibold text-primary hover:text-primary-dark underline cursor-pointer"
                      />
                    ) : (
                      <span className="font-semibold" />
                    ),
                  }}
                />
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    // Data changed - needs retraining
    if (dataHasChanged) {
      return (
        <div className="bg-amber-50 rounded-lg p-5 mb-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-amber-900 mb-1">{t('statusBanner.needRetrainTitle')}</h4>
              <p className="text-sm text-amber-700">
                <Trans
                  i18nKey="statusBanner.needRetrainBodyModel"
                  components={{
                    tab: onGoToTraining ? (
                      <button
                        onClick={onGoToTraining}
                        className="font-semibold text-amber-900 hover:text-amber-950 underline cursor-pointer"
                      />
                    ) : (
                      <span className="font-semibold" />
                    ),
                  }}
                />
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    // Trained and ready to test
    return (
      <div className="bg-green-50 rounded-lg p-5 mb-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-green-900 mb-1">{t('statusBanner.aiReadyTitle')}</h4>
            <p className="text-sm text-green-700">
              {t('statusBanner.aiReadyTestBody')}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // Fallback (shouldn't reach here)
  return null;
}
