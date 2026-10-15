import { useEffect, useMemo, useState } from 'react';
import X from 'lucide-react/dist/esm/icons/x';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import Search from 'lucide-react/dist/esm/icons/search';
import Check from 'lucide-react/dist/esm/icons/check';
import { useTranslation } from 'react-i18next';
import {
  LibraryClass,
  getLibraryClasses,
  tileStyle,
  extractTiles,
  allTileIndices,
} from '../library/library';

type LibraryPickerProps =
  | {
      // Select several pictures from one class to add to a group.
      mode: 'images';
      onAdd: (dataUrls: string[]) => void | Promise<void>;
      onClose: () => void;
    }
  | {
      // Tap one picture to test the model with; closes right away.
      mode: 'single';
      onPick: (dataUrl: string) => void;
      onClose: () => void;
    };

export function LibraryPicker(props: LibraryPickerProps) {
  const { mode, onClose } = props;
  const { t } = useTranslation();
  const [classes, setClasses] = useState<LibraryClass[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [addError, setAddError] = useState(false);
  // The class being viewed and, in 'images' mode, the chosen tile indices.
  const [openClass, setOpenClass] = useState<LibraryClass | null>(null);
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);

  useEffect(() => {
    getLibraryClasses().then(setClasses).catch(() => setLoadError(true));
  }, []);

  const filtered = useMemo(() => {
    if (!classes) return [];
    const q = query.trim().toLowerCase();
    return q ? classes.filter((c) => c.name.toLowerCase().includes(q)) : classes;
  }, [classes, query]);

  const handleClassClick = (cls: LibraryClass) => {
    setOpenClass(cls);
    setSelectedTiles([]);
  };

  const handleTileClick = async (cls: LibraryClass, index: number) => {
    if (props.mode === 'images') {
      setSelectedTiles((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
      return;
    }
    try {
      const [dataUrl] = await extractTiles(cls, [index]);
      props.onPick(dataUrl);
      onClose();
    } catch (error) {
      console.error('Error picking library image:', error);
      setAddError(true);
    }
  };

  const handleAdd = async () => {
    if (props.mode !== 'images' || !openClass || selectedTiles.length === 0) return;
    setBusy(true);
    setAddError(false);
    try {
      const sorted = [...selectedTiles].sort((a, b) => a - b);
      await props.onAdd(await extractTiles(openClass, sorted));
      onClose();
    } catch (error) {
      console.error('Error adding library images:', error);
      setAddError(true);
    } finally {
      setBusy(false);
    }
  };

  const classCard = (cls: LibraryClass) => (
    <button
      key={cls.slug}
      type="button"
      onClick={() => handleClassClick(cls)}
      className="text-left rounded-lg overflow-hidden border-2 border-transparent hover:border-primary/40 transition-colors"
    >
      <div className="aspect-square rounded-md bg-gray-100" style={tileStyle(cls, 0)} />
      <div className="px-1 py-1.5">
        <p className="text-sm font-medium text-gray-900 truncate" title={cls.name}>{cls.name}</p>
      </div>
    </button>
  );

  const grid = (items: LibraryClass[]) => (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">{items.map(classCard)}</div>
  );

  const renderBrowse = () => {
    if (loadError) {
      return <p className="text-center text-red-600 py-8">{t('library.error')}</p>;
    }
    if (!classes) {
      return <p className="text-center text-gray-500 py-8">{t('library.loading')}</p>;
    }
    if (filtered.length === 0) {
      return <p className="text-center text-gray-500 py-8">{t('library.noResults', { query })}</p>;
    }
    return grid(filtered);
  };

  const renderClassTiles = (cls: LibraryClass) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-gray-600">
          {mode === 'images' ? t('library.tapToSelect') : t('library.tapToTest')}
        </p>
        {mode === 'images' && (
          <button
            type="button"
            onClick={() =>
              setSelectedTiles(selectedTiles.length === cls.count ? [] : allTileIndices(cls))
            }
            className="text-primary hover:text-primary-dark text-sm font-medium whitespace-nowrap"
          >
            {selectedTiles.length === cls.count ? t('library.clearSelection') : t('library.selectAll')}
          </button>
        )}
      </div>
      {mode === 'single' && addError && (
        <p className="text-sm text-red-600">{t('library.error')}</p>
      )}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
        {allTileIndices(cls).map((i) => {
          const selected = selectedTiles.includes(i);
          return (
            <button
              key={i}
              type="button"
              onClick={() => handleTileClick(cls, i)}
              aria-pressed={mode === 'images' ? selected : undefined}
              aria-label={`${cls.name} ${i + 1}`}
              className={`relative aspect-square rounded-lg bg-gray-100 border-4 transition-colors ${
                selected ? 'border-primary' : 'border-transparent hover:border-primary/40'
              }`}
              style={tileStyle(cls, i)}
            >
              {selected && (
                <span className="absolute top-1 right-1 bg-primary text-white rounded-full p-0.5 shadow">
                  <Check size={14} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 border-b px-4 py-3 flex items-center justify-between gap-2 rounded-t-lg">
          <div className="flex items-center gap-2 min-w-0">
            {openClass && (
              <button
                type="button"
                onClick={() => setOpenClass(null)}
                className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                title={t('library.back')}
              >
                <ArrowLeft size={20} className="rtl:rotate-180" />
              </button>
            )}
            <h3 className="text-lg font-semibold truncate">{openClass?.name ?? t('library.titleImages')}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title={t('imageUpload.close')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search (browse view only) */}
        {!openClass && (
          <div className="flex-shrink-0 px-4 pt-4">
            <div className="relative">
              <Search size={18} className="absolute top-1/2 -translate-y-1/2 start-3 text-gray-400 pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('library.searchPlaceholder')}
                className="w-full ps-10 pe-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {openClass ? renderClassTiles(openClass) : renderBrowse()}
        </div>

        {/* Footer ('images' mode, class view) */}
        {mode === 'images' && openClass && (
          <div className="flex-shrink-0 border-t px-4 py-3 flex items-center gap-3 rounded-b-lg">
            {addError && <p className="text-sm text-red-600">{t('library.error')}</p>}
            <button
              type="button"
              onClick={handleAdd}
              disabled={busy || selectedTiles.length === 0}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium whitespace-nowrap"
            >
              {busy ? t('imageUpload.processing') : t('library.addImages', { count: selectedTiles.length })}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
