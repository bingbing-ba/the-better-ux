'use client';

import { cn } from '@/lib/utils';
import { ImageWithGrayPlaceholder, ImageWithBlurhash } from './ImageComponents';

// Image assets from spec supplement
const IMAGES = [
  'https://storage.googleapis.com/the-better-ux/image-loading-blurhash/profile-1.png',
  'https://storage.googleapis.com/the-better-ux/image-loading-blurhash/profile-2.png',
  'https://storage.googleapis.com/the-better-ux/image-loading-blurhash/profile-3.png',
  'https://storage.googleapis.com/the-better-ux/image-loading-blurhash/profile-4.png',
];

// Blurhash strings from spec supplement (order 1→4)
const BLURHASHES = [
  ':VJ8Lut7%g9ZIBV@ozW;~WxukXR*DiWAWBofIotRi_oJxvWBjYoJW=WCs.V@ozoga#oft7aeaea}M{WCofofogt7RjaekCWBs:oJoft7WXRjoJf6RkayxuofWBWBayj[RjWB',
  ':fO:w*jZ?wbIR5oLNGayD*bH%1aeR*ofaxayo~ofROWCW=j[t7a}%2j@NHWVoJj[offQxuj[M{ayt7j]WBfRoIaeR*oft7aeRjayozazaeoLj[azWVj[ayayfPofWBWBofj[',
  ':QIqP|IU0fs,wHs:n%bI00^+%goLt6R*f6WV.TRk,:NFIpoeW=of9ut7w]%3RkoMbcayaet7xvNGWVWBoLj[-=NHR%WBNat7aeofafX9R-t7jZRks:axozt8bbNGn$WBoeof',
  ':SKK$qoz.TkCwHoeShj]~qWBM_WVIUjsWBay0KjsnMoftSbHxaj[.8ayR*jZoLWBRjoLjFj[M{j[j[ofoLfPRjj[t7WBt7oeRjWBofjtbHWVRioLWVa}Rjays:kCj[f6t7WB',
];

// Don't example: gray placeholder, no blurhash, demo delay
export function DontExample() {
  return (
    <div>
      <h2 className={cn('mb-4 text-2xl font-semibold text-red-900')}>❌ Don&apos;t</h2>
      {/* Fixed height to prevent layout shift */}
      <p className={cn('mb-6 h-12 text-gray-700')}>
        Uniform gray placeholders provide no visual context while images load.
      </p>
      <div className={cn('grid grid-cols-2 gap-4')}>
        {IMAGES.map((src, idx) => (
          <ImageWithGrayPlaceholder
            key={idx}
            src={src}
            alt={`Profile ${idx + 1} - bad example with no visual preview while loading`}
          />
        ))}
      </div>
    </div>
  );
}

// Do example: blurhash placeholder, smooth transition, demo delay
export function DoExample() {
  return (
    <div>
      <h2 className={cn('mb-4 text-2xl font-semibold text-green-900')}>✅ Do</h2>
      {/* Fixed height to prevent layout shift */}
      <p className={cn('mb-6 h-12 text-gray-700')}>
        Blurhash shows an instant preview, creating smooth, professional loading.
      </p>
      <div className={cn('grid grid-cols-2 gap-4')}>
        {IMAGES.map((src, idx) => (
          <ImageWithBlurhash
            key={idx}
            src={src}
            blurhash={BLURHASHES[idx]}
            alt={`Profile ${idx + 1} - good example with blurhash preview for smooth loading`}
          />
        ))}
      </div>
    </div>
  );
}

