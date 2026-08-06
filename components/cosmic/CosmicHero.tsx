import React from 'react';

interface CosmicHeroProps {
  title: string;
  tagline: string;
  description: string;
}

export const CosmicHero: React.FC<CosmicHeroProps> = ({ title, tagline, description }) => {
  const [imageFailed, setImageFailed] = React.useState(false);
  const heroSrc = `${import.meta.env.BASE_URL}assets/cosmic/black-hole-hero.webp`;

  return (
    <header
      data-testid="black-hole-hero"
      className="cosmic-hero cosmic-hero-fallback cosmic-glass relative isolate overflow-hidden rounded-[1.75rem]"
    >
      <div className="cosmic-hero__image" aria-hidden="true">
        {!imageFailed && (
          <img
            data-testid="black-hole-image"
            src={heroSrc}
            alt=""
            decoding="async"
            fetchPriority="high"
            onError={() => setImageFailed(true)}
          />
        )}
      </div>
      <div className="cosmic-hero__scrim" aria-hidden="true" />
      <div className="cosmic-hero__content relative z-10">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-200">{tagline}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">{description}</p>
        <div className="mt-7 flex max-w-xl items-center" aria-hidden="true">
          <span className="cosmic-divider flex-1" />
          <span className="size-2 rounded-full bg-blue-200 shadow-[0_0_18px_rgba(183,232,255,.9)]" />
        </div>
      </div>
    </header>
  );
};
