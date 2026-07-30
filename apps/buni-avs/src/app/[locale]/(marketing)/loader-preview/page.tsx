import { BuniLoader } from '@buni/ui';

export default function LoaderPreviewPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Dark background version */}
      <div className="flex-1 bg-avs-secondary flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-12">
          <h2 className="text-avs-accent text-center font-display text-2xl mb-4">Fond Noir</h2>
          
          <div>
            <h3 className="text-avs-accent text-center mb-4 font-display text-lg">Size 80</h3>
            <BuniLoader size={80} theme="dark" />
          </div>
          
          <div>
            <h3 className="text-avs-accent text-center mb-4 font-display text-lg">Size 120</h3>
            <BuniLoader size={120} theme="dark" />
          </div>
          
          <div>
            <h3 className="text-avs-accent text-center mb-4 font-display text-lg">Size 160 (no text)</h3>
            <BuniLoader size={160} theme="dark" showText={false} />
          </div>
        </div>
      </div>

      {/* Light background version */}
      <div className="flex-1 bg-white flex items-center justify-center p-8 border-t border-avs-accent/10">
        <div className="flex flex-col items-center gap-12">
          <h2 className="text-avs-accent text-center font-display text-2xl mb-4">Fond Blanc</h2>
          
          <div>
            <h3 className="text-avs-accent text-center mb-4 font-display text-lg">Size 80</h3>
            <BuniLoader size={80} theme="light" />
          </div>
          
          <div>
            <h3 className="text-avs-accent text-center mb-4 font-display text-lg">Size 120</h3>
            <BuniLoader size={120} theme="light" />
          </div>
          
          <div>
            <h3 className="text-avs-accent text-center mb-4 font-display text-lg">Size 160 (no text)</h3>
            <BuniLoader size={160} theme="light" showText={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
