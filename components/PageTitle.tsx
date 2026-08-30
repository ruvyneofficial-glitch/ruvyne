type PageTitleProps = {
  children: React.ReactNode;
  className?: string;
  /** Path to a pre-drawn display wordmark. Mutually exclusive with `wordmark`. */
  imgSrc?: string;
  imgAlt?: string;
  /**
   * Renders the display wordmark as live text in the site typeface instead of a
   * pre-drawn SVG file. Used where the wording is brand copy that can change,
   * so there is no outlined-letterform asset to keep in sync.
   */
  wordmark?: string;
};

export default function PageTitle({
  children,
  className,
  imgSrc,
  imgAlt,
  wordmark,
}: PageTitleProps) {
  return (
    <div className="max-w-[95rem] w-full mx-auto">
      <h1 className={className}>{children}</h1>
      {wordmark && (
        <svg
          aria-hidden="true"
          className="py-6 md:py-12 h-full w-full"
          viewBox="0 0 1520 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text
            x="0"
            y="82"
            textLength="1520"
            lengthAdjust="spacing"
            fill="black"
            fontFamily="General Sans, system-ui, sans-serif"
            fontSize="112"
            fontWeight="600"
          >
            {wordmark.toUpperCase()}
          </text>
        </svg>
      )}
      {imgSrc && (
        <img
          src={imgSrc}
          alt={imgAlt}
          className="py-6 md:py-12 h-full w-full"
        />
      )}
    </div>
  );
}
