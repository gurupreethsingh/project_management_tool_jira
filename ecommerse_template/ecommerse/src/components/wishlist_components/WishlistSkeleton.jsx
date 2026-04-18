import React from "react";

const SkeletonCard = () => (
  <div className="rounded-2xl border border-slate-200 bg-white p-2.5 animate-pulse">
    <div className="aspect-square rounded-xl bg-slate-100" />
    <div className="mt-2.5 h-3 rounded bg-slate-100" />
    <div className="mt-2 h-3 w-2/3 rounded bg-slate-100" />
    <div className="mt-3 h-9 rounded-full bg-slate-100" />
    <div className="mt-2 grid grid-cols-2 gap-2">
      <div className="h-9 rounded-full bg-slate-100" />
      <div className="h-9 rounded-full bg-slate-100" />
    </div>
  </div>
);

const WishlistSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export default WishlistSkeleton;
