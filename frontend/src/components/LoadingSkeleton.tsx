import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'card' | 'text' | 'circle' | 'rectangle';
  count?: number;
}

const LoadingSkeleton = ({
  className = '',
  variant = 'rectangle',
  count = 1,
}: LoadingSkeletonProps) => {
  const skeletonVariants: Record<string, string> = {
    card: 'aspect-square rounded-lg',
    text: 'h-4 rounded',
    circle: 'rounded-full w-10 h-10',
    rectangle: 'h-6 rounded',
  };

  const skeletons = Array.from({ length: count }, (_, index) => (
    <motion.div
      key={index}
      className={`relative overflow-hidden bg-gray-300 ${skeletonVariants[variant]} ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 50%, #e5e7eb 100%)',
        backgroundSize: '200% 100%',
        backgroundRepeat: 'no-repeat',
      }}
      animate={{
        backgroundPosition: ['-200% 0', '200% 0'],
      }}
      transition={{
        duration: 1.5,
        ease: 'linear',
        repeat: Infinity,
      }}
    />
  ));

  return count === 1 ? skeletons[0] : <>{skeletons}</>;
};

export default LoadingSkeleton;
