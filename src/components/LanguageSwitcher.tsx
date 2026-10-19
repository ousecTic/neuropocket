import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Globe from 'lucide-react/dist/esm/icons/globe';
import Check from 'lucide-react/dist/esm/icons/check';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../i18n';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  // Menu position (fixed coordinates), captured from the button when the menu opens.
  const [menuPos, setMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const currentCode = i18n.language;
  const current =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentCode) ?? SUPPORTED_LANGUAGES[0];
  // Only some locales credit their translators; skip the English fallback.
  const hasTranslationCredit = i18n.exists('languageSwitcher.translationCredit', {
    lng: currentCode,
    fallbackLng: [],
  });

  const MENU_WIDTH = 176; // matches w-44 (11rem)

  const openMenu = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      // Anchor the menu to the button's start edge per reading direction (in RTL the header
      // flips, so the switcher sits on the left), then clamp it inside the viewport. Using
      // left coordinates keeps the same origin as getBoundingClientRect (no scrollbar-side
      // ambiguity in RTL).
      const isRTL = document.documentElement.dir === 'rtl';
      const desired = isRTL ? rect.left : rect.right - MENU_WIDTH;
      const maxLeft = window.innerWidth - MENU_WIDTH - 8;
      setMenuPos({ top: rect.bottom + 8, left: Math.min(Math.max(8, desired), maxLeft) });
    }
    setIsOpen(true);
  };

  // Close when clicking outside both the trigger and the (portaled) menu.
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !buttonRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    // The menu is positioned at open time; scrolling/resizing would make it drift, so close it.
    const handleReposition = () => setIsOpen(false);
    // Scrolling the (scrollable) menu list itself must not close it.
    const handleScroll = (event: Event) => {
      if (event.target instanceof Node && menuRef.current?.contains(event.target)) return;
      handleReposition();
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleReposition);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleReposition);
    };
  }, [isOpen]);

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => (isOpen ? setIsOpen(false) : openMenu())}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
        aria-label={t('languageSwitcher.label')}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <Globe size={18} className="flex-shrink-0" />
        <span className="text-sm font-medium hidden sm:inline">{current.label}</span>
      </button>

      {isOpen &&
        createPortal(
          <ul
            ref={menuRef}
            role="listbox"
            style={{ position: 'fixed', top: menuPos.top, left: menuPos.left }}
            className="w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[60] max-h-80 overflow-y-auto"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <li key={lang.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={lang.code === currentCode}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between gap-2 px-4 py-2 text-sm text-start hover:bg-gray-50 transition-colors ${
                    lang.code === currentCode ? 'text-primary font-medium' : 'text-gray-700'
                  }`}
                >
                  <span>{lang.label}</span>
                  {lang.code === currentCode && <Check size={16} className="flex-shrink-0" />}
                </button>
              </li>
            ))}
            {hasTranslationCredit && (
              <li role="none" className="border-t border-gray-100 mt-1 px-4 pt-2 pb-1 text-xs text-gray-500">
                {t('languageSwitcher.translationCredit')}
              </li>
            )}
          </ul>,
          document.body,
        )}
    </div>
  );
}
