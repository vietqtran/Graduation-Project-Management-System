'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

const HomePage = () => {
  return (
    <div className='flex items-center justify-center h-screen w-full'>
      <Card className='w-full h-full flex flex-col items-center justify-center shadow-lg rounded-lg border border-gray-300 bg-white'>
        <CardHeader className='text-center'>
          <div className='flex flex-col items-center justify-center mt-10'>
            <Image
              src='/gif/opinions.gif'
              alt='Status icon'
              width={100}
              height={100}
            />
          </div>
          <CardTitle className='text-xl font-semibold mt-4'>Keep working on your project!</CardTitle>
        </CardHeader>
        <CardContent className='text-center text-gray-600'>
          Continue learning and applying what you have learned.
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
