import React from 'react';
import { Link } from 'react-router-dom';

export const MusicGrid = ({
  title,
  subtitle,
  seeAllLink,
  children,
  className = '',
}) => {
  return (
    <section className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
          {subtitle && <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>}
        </div>
        {seeAllLink && (
          <Link
            to={seeAllLink}
            className="text-xs font-semibold text-[#C6F432] hover:underline"
          >
            See all
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {children}
      </div>
    </section>
  );
};

export default MusicGrid;
