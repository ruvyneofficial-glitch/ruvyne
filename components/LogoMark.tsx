type LogoMarkProps = {
  /** Sizing and colour classes, e.g. "h-10 w-auto text-white". */
  className?: string;
  /**
   * Accessible name. Omit when the mark sits next to the Wordmark, which already
   * names the brand; the mark is then hidden from assistive tech as decoration.
   */
  label?: string;
};

/**
 * The Ruvyne mark: the RV monogram with the figure, pendant lamp, books and vase.
 *
 * The wordmark is deliberately not part of this component. It stays live text in
 * components/Wordmark.tsx so the brand name is only ever written in lib/site.ts.
 * The full lockup, mark and wordmark together, lives in public/logo.svg for social
 * cards and print.
 *
 * The monogram is painted in currentColor, so the mark inherits the surrounding
 * text colour: black in the header, white on the black footer. The illustration
 * uses the neutral scale from app/globals.css, which reads on either ground.
 */
export default function LogoMark({ className = "", label }: LogoMarkProps) {
  const leaf = "M0 0 C 10 -12 30 -14 40 -6 C 30 4 10 6 0 0 Z";

  return (
    <svg
      viewBox="194 180 792 588"
      fill="none"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {label ? <title>{label}</title> : null}

      {/* Still life: pendant lamp, books, vase and branch */}
      <g>
        <path
          d="M690 336 C 730 290 812 290 852 336"
          stroke="#A3A3A3"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M771 302 L771 392"
          stroke="#A3A3A3"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <rect x="764" y="388" width="14" height="20" rx="3" fill="#737373" />
        <path d="M716 452 C 724 408 818 408 826 452 Z" fill="#737373" />

        <rect x="722" y="546" width="112" height="20" rx="3" fill="#E5E5E5" />
        <rect x="712" y="570" width="132" height="22" rx="3" fill="#737373" />
        <rect x="718" y="596" width="120" height="20" rx="3" fill="#A3A3A3" />

        <rect x="854" y="616" width="44" height="10" rx="4" fill="#A3A3A3" />
        <path
          d="M862 626 L862 642 C 830 658 820 700 838 724 C 856 748 900 748 916 722
             C 932 696 918 656 890 642 L890 626 Z"
          fill="#E5E5E5"
        />

        <path
          d="M876 612 C 900 560 920 512 952 478"
          stroke="#737373"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path d={leaf} fill="#A3A3A3" transform="translate(884 574) rotate(-38)" />
        <path d={leaf} fill="#737373" transform="translate(880 566) rotate(-142) scale(-1 1)" />
        <path d={leaf} fill="#A3A3A3" transform="translate(902 528) rotate(-30)" />
        <path d={leaf} fill="#737373" transform="translate(898 520) rotate(-150) scale(-1 1)" />
        <path d={leaf} fill="#A3A3A3" transform="translate(926 490) rotate(-24)" />
        <path d={leaf} fill="#737373" transform="translate(922 482) rotate(-156) scale(-1 1)" />
      </g>

      {/* RV monogram */}
      <g transform="translate(-40 0)" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M300 200 H400 V214 H372 V546 H410 V560 H292 V546 H320 V214 H300 Z"
        />
        <path
          fillRule="evenodd"
          d="M366 200 C 470 200 520 236 520 290 C 520 344 470 380 366 380 Z
             M366 236 V344 C 442 344 472 326 472 290 C 472 254 442 236 366 236 Z"
        />
        <path d="M404 372 H452 L560 560 H500 Z" />

        <path d="M580 200 H684 V214 H596 Z" />
        <path d="M800 200 H876 V214 H812 Z" />
        <path d="M596 206 L668 206 L748 470 L812 206 L856 206 L764 560 L700 560 Z" />
      </g>

      {/* Connecting swash */}
      <path
        d="M236 500 C 350 424 486 470 580 578 C 664 674 792 712 902 668
           C 946 650 944 602 908 594"
        stroke="#737373"
        strokeWidth="16"
        strokeLinecap="round"
      />

      {/* Figure: wide-brimmed hat and flowing cape */}
      <g transform="translate(-44 0)">
        <ellipse cx="312" cy="424" rx="98" ry="20" fill="#A3A3A3" />
        <path
          d="M262 424 C 264 380 282 354 316 354 C 350 354 366 380 368 424 Z"
          fill="#737373"
        />
        <path
          d="M266 410 C 300 420 336 420 366 410 L368 424 C 336 434 294 434 262 424 Z"
          fill="#E5E5E5"
        />

        <path
          d="M330 468 C 300 480 276 512 268 560 C 256 630 250 672 258 712
             C 330 726 420 714 500 686 C 440 640 392 574 366 486 Z"
          fill="#E5E5E5"
        />
        <path
          d="M330 468 C 320 540 330 620 372 690 C 340 700 300 704 262 700
             C 252 640 268 540 300 486 Z"
          fill="#A3A3A3"
        />
        <path
          d="M326 464 C 346 468 358 480 364 496 C 344 502 328 496 318 484 Z"
          fill="#737373"
        />
      </g>
    </svg>
  );
}
