export default function Home() {
  return (
    <div className='bg-gray-900'>
      <div className='mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8'>
        <div className='relative isolate overflow-hidden bg-gray-800 px-6 py-24 text-center after:pointer-events-none after:absolute after:inset-0 after:inset-ring after:inset-ring-white/10 sm:rounded-3xl sm:px-16 after:sm:rounded-3xl'>
          <h2 className='text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl'>
            Projeta+
          </h2>
          <p className='mx-auto mt-6 max-w-xl text-lg/8 text-pretty text-gray-300'>
            Incididunt sint fugiat pariatur cupidatat consectetur sit cillum
            anim id veniam aliqua proident excepteur commodo do ea.
          </p>
          <div className='mt-10 flex items-center justify-center gap-x-6'>
            <a
              href='#'
              className='rounded-md bg-white/10 px-3.5 py-2.5 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
            >
              {' '}
              Get started{' '}
            </a>
            <a href='/pricing' className='text-sm/6 font-semibold text-white'>
              Pricing
              <span aria-hidden='true'>→</span>
            </a>
          </div>
          <svg
            viewBox='0 0 1024 1024'
            aria-hidden='true'
            className='absolute top-1/2 left-1/2 -z-10 size-256 -translate-x-1/2 mask-[radial-gradient(closest-side,white,transparent)]'
          >
            <circle
              r={512}
              cx={512}
              cy={512}
              fill='url(#827591b1-ce8c-4110-b064-7cb85a0b1217)'
              fillOpacity='0.7'
            />
            <defs>
              <radialGradient id='827591b1-ce8c-4110-b064-7cb85a0b1217'>
                <stop stopColor='#7775D6' />
                <stop offset={1} stopColor='#E935C1' />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
