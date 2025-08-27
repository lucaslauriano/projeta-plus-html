import { auth } from '@clerk/nextjs/server';

export default async function BronzeContentPage() {
  const { has, userId } = await auth();

  const hasBronzePlan = has({ plan: 'pro_user' });

  if (!hasBronzePlan)
    return (
      <div className='p-6'>
        {' '}
        <h1>Sorry, you don&apos;t have access to this content.</h1>
      </div>
    );

  return (
    <div className='p-6'>
      <h1>Welcome! {userId}</h1>
    </div>
  );
}
