"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Ticket } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { LocalTime } from '@/components/local-time';
import { getPricingForRound } from '@/lib/pricing';

const stockImages = [
  'https://images.unsplash.com/photo-1518605368461-1ee7c532066d?w=1175&q=80',
  'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1175&q=80',
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1175&q=80',
  'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=1175&q=80',
  'https://images.unsplash.com/photo-1556800539-75f10645f061?w=1175&q=80',
  'https://images.unsplash.com/photo-1600250395378-b114d56d787d?w=1175&q=80',
  'https://images.unsplash.com/photo-1574629810360-7efbc1749e56?w=1175&q=80',
];

const FULL_WIDTH_PX = 120;
const COLLAPSED_WIDTH_PX = 35;
const GAP_PX = 2;
const MARGIN_PX = 2;

function Thumbnails({ index, setIndex, items }: { index: number, setIndex: (i: number) => void, items: any[] }) {
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (thumbnailsRef.current) {
      let scrollPosition = 0;
      for (let i = 0; i < index; i++) {
        scrollPosition += COLLAPSED_WIDTH_PX + GAP_PX;
      }
      scrollPosition += MARGIN_PX;
      const containerWidth = thumbnailsRef.current.offsetWidth;
      const centerOffset = containerWidth / 2 - FULL_WIDTH_PX / 2;
      scrollPosition -= centerOffset;
      thumbnailsRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  }, [index]);

  return (
    <div
      ref={thumbnailsRef}
      className='overflow-x-auto'
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <style>{`.overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>
      <div className='flex gap-0.5 h-16 pb-1' style={{ width: 'fit-content' }}>
        {items.map((item, i) => (
          <motion.button
            key={item.id}
            onClick={() => setIndex(i)}
            initial={false}
            animate={i === index ? 'active' : 'inactive'}
            variants={{
              active:   { width: FULL_WIDTH_PX, marginLeft: MARGIN_PX, marginRight: MARGIN_PX },
              inactive: { width: COLLAPSED_WIDTH_PX, marginLeft: 0, marginRight: 0 },
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className='relative shrink-0 h-full overflow-hidden rounded-lg ring-1 ring-border'
          >
            <img
              src={item.image}
              alt={item.title}
              className='w-full h-full object-cover pointer-events-none select-none'
              draggable={false}
            />
            {i === index && (
              <div className="absolute inset-0 ring-2 ring-inset ring-primary/70 rounded-lg pointer-events-none" />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function PremiumSlide({ item, isActive }: { item: any; isActive: boolean }) {
  const pricing = getPricingForRound(item.round);

  return (
    <div className='shrink-0 w-full h-[520px] sm:h-[560px] relative overflow-hidden'>
      {/* Full-bleed stadium image — fully visible */}
      <img
        src={item.image}
        alt={item.title}
        className='absolute inset-0 w-full h-full object-cover select-none pointer-events-none transition-transform duration-700'
        draggable={false}
      />

      {/* Subtle gradient only at the bottom so the image stays visible */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

      {/* Top badge */}
      <div className="absolute top-5 left-5 z-10 bg-black/50 backdrop-blur-md border border-white/15 text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
        {item.round?.replace(/_/g, ' ')}
      </div>

      {/* From price badge */}
      <div className="absolute top-5 right-5 z-10 bg-primary text-primary-foreground text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg">
        From ${pricing.min.toLocaleString()}
      </div>

      {/* Bottom info panel — fused with the card */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-5 sm:p-7">
        {/* Teams row */}
        <div className="flex items-center justify-between mb-4">
          {/* Home Team */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/30 overflow-hidden shadow-xl flex items-center justify-center relative">
              {item.homeTeam?.flagUrl ? (
                <Image src={item.homeTeam.flagUrl} alt={item.homeTeam.name} fill className="object-cover" />
              ) : (
                <span className="text-white font-bold text-xs">{item.homeTeam?.countryCode || 'TBD'}</span>
              )}
            </div>
            <span className="text-white font-bold text-sm drop-shadow-md">{item.homeTeam?.countryCode || 'TBD'}</span>
          </div>

          {/* VS bubble */}
          <div className="text-center">
            <div className="text-white/50 text-xs font-semibold tracking-widest uppercase mb-1">Match {item.matchNumber}</div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-black text-lg px-4 py-1.5 rounded-full shadow-lg">
              VS
            </div>
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/30 overflow-hidden shadow-xl flex items-center justify-center relative">
              {item.awayTeam?.flagUrl ? (
                <Image src={item.awayTeam.flagUrl} alt={item.awayTeam.name} fill className="object-cover" />
              ) : (
                <span className="text-white font-bold text-xs">{item.awayTeam?.countryCode || 'TBD'}</span>
              )}
            </div>
            <span className="text-white font-bold text-sm drop-shadow-md">{item.awayTeam?.countryCode || 'TBD'}</span>
          </div>
        </div>

        {/* Match title */}
        <h3 className="text-white font-black text-xl sm:text-2xl mb-3 drop-shadow-lg text-center">
          {item.homeTeam?.name || 'TBD'} vs {item.awayTeam?.name || 'TBD'}
        </h3>

        {/* Meta row */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-5 text-white/70 text-xs font-semibold">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <LocalTime date={item.kickoffUtc} />
          </span>
          <span className="hidden sm:inline text-white/30">·</span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            {item.stadium?.name}, {item.stadium?.city}
          </span>
        </div>

        {/* CTA */}
        <div className="flex justify-center" style={{ pointerEvents: isActive ? 'auto' : 'none' }}>
          <Link
            href={`/matches/${item.slug}`}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-black px-8 py-3 rounded-full text-sm hover:bg-primary/90 hover:scale-105 transition-all shadow-2xl"
          >
            <Ticket className="w-4 h-4" />
            Buy Tickets
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ThumbnailCarousel({ matches }: { matches: any[] }) {
  const [index, setIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);

  const items = matches.map((match, i) => ({
    ...match,
    image: match.stadium?.imageUrl || stockImages[i % stockImages.length],
    title: `${match.homeTeam?.name || 'TBD'} vs ${match.awayTeam?.name || 'TBD'}`
  }));

  useEffect(() => {
    if (!isDragging && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth || 1;
      const targetX = -index * containerWidth;
      animate(x, targetX, { type: 'spring', stiffness: 300, damping: 30 });
    }
  }, [index, x, isDragging]);

  if (!matches || matches.length === 0) return null;

  return (
    <div className='w-full max-w-5xl mx-auto'>
      <div className='flex flex-col gap-2'>
        <div className='relative overflow-hidden rounded-2xl shadow-2xl' ref={containerRef}>
          <motion.div
            className='flex'
            drag='x'
            dragElastic={0.2}
            dragMomentum={false}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(e, info) => {
              setIsDragging(false);
              const containerWidth = containerRef.current?.offsetWidth || 1;
              const offset = info.offset.x;
              const velocity = info.velocity.x;

              let newIndex = index;
              if (Math.abs(velocity) > 500) {
                newIndex = velocity > 0 ? index - 1 : index + 1;
              } else if (Math.abs(offset) > containerWidth * 0.3) {
                newIndex = offset > 0 ? index - 1 : index + 1;
              }

              newIndex = Math.max(0, Math.min(items.length - 1, newIndex));
              setIndex(newIndex);
            }}
            style={{ x }}
          >
            {items.map((item, i) => (
              <PremiumSlide key={item.id} item={item} isActive={i === index} />
            ))}
          </motion.div>

          {/* Nav arrows */}
          <button
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className={`absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center shadow-xl z-20 border border-white/20 transition-all
              ${index === 0 ? 'opacity-30 cursor-not-allowed bg-black/30' : 'bg-black/40 backdrop-blur-md hover:bg-black/60 hover:scale-110 text-white'}`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            disabled={index === items.length - 1}
            onClick={() => setIndex((i) => Math.min(items.length - 1, i + 1))}
            className={`absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center shadow-xl z-20 border border-white/20 transition-all
              ${index === items.length - 1 ? 'opacity-30 cursor-not-allowed bg-black/30' : 'bg-black/40 backdrop-blur-md hover:bg-black/60 hover:scale-110 text-white'}`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Counter pill */}
          <div className='absolute top-5 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md border border-white/15 text-white px-3 py-1 rounded-full text-xs font-bold z-20'>
            {index + 1} / {items.length}
          </div>
        </div>

        <Thumbnails index={index} setIndex={setIndex} items={items} />
      </div>
    </div>
  );
}

