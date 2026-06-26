"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MatchCard from '@/components/match-card';

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

      thumbnailsRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    }
  }, [index]);

  return (
    <div
      ref={thumbnailsRef}
      className='overflow-x-auto'
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <style>{`
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className='flex gap-0.5 h-20 pb-2' style={{ width: 'fit-content' }}>
        {items.map((item, i) => (
          <motion.button
            key={item.id}
            onClick={() => setIndex(i)}
            initial={false}
            animate={i === index ? 'active' : 'inactive'}
            variants={{
              active: {
                width: FULL_WIDTH_PX,
                marginLeft: MARGIN_PX,
                marginRight: MARGIN_PX,
              },
              inactive: {
                width: COLLAPSED_WIDTH_PX,
                marginLeft: 0,
                marginRight: 0,
              },
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className='relative shrink-0 h-full overflow-hidden rounded ring-1 ring-border'
          >
            <img
              src={item.image}
              alt={item.title}
              className='w-full h-full object-cover pointer-events-none select-none'
              draggable={false}
            />
            {i === index && (
              <div className="absolute inset-0 bg-primary/20 pointer-events-none" />
            )}
          </motion.button>
        ))}
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
    image: stockImages[i % stockImages.length],
    title: `${match.homeTeam?.name || 'TBD'} vs ${match.awayTeam?.name || 'TBD'}`
  }));

  useEffect(() => {
    if (!isDragging && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth || 1;
      const targetX = -index * containerWidth;

      animate(x, targetX, {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      });
    }
  }, [index, x, isDragging]);

  if (!matches || matches.length === 0) return null;

  return (
    <div className='w-full max-w-5xl mx-auto'>
      <div className='flex flex-col gap-3'>
        <div className='relative overflow-hidden rounded-xl bg-muted border border-border shadow-md' ref={containerRef}>
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
              <div key={item.id} className='shrink-0 w-full h-[500px] relative flex items-center justify-center p-4 md:p-12'>
                <img
                  src={item.image}
                  alt={item.title}
                  className='absolute inset-0 w-full h-full object-cover select-none pointer-events-none opacity-40 mix-blend-overlay'
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
                
                <div className="relative z-10 w-full max-w-md" style={{ pointerEvents: i === index ? 'auto' : 'none' }}>
                  <MatchCard match={item} />
                </div>
              </div>
            ))}
          </motion.div>

          <motion.button
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className={`absolute left-4 text-foreground top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform z-20 border border-border
              ${index === 0 ? 'opacity-40 cursor-not-allowed bg-muted' : 'bg-background hover:scale-110 hover:opacity-100 opacity-90'}`}
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          <motion.button
            disabled={index === items.length - 1}
            onClick={() => setIndex((i) => Math.min(items.length - 1, i + 1))}
            className={`absolute text-foreground right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform z-20 border border-border
              ${index === items.length - 1 ? 'opacity-40 cursor-not-allowed bg-muted' : 'bg-background hover:scale-110 hover:opacity-100 opacity-90'}`}
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>

          <div className='absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-md border border-border text-foreground px-4 py-1.5 rounded-full text-xs font-bold z-20'>
            {index + 1} / {items.length}
          </div>
        </div>

        <Thumbnails index={index} setIndex={setIndex} items={items} />
      </div>
    </div>
  );
}
