'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface UploadInspirationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUseDefault: () => void;
}

export function UploadInspirationModal({
  open,
  onOpenChange,
  onUseDefault,
}: UploadInspirationModalProps) {
  const handleUseDefault = () => {
    onUseDefault();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Inspiration Image</DialogTitle>
          <DialogDescription>
            Choose an inspiration image for your room
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Default inspiration image placeholder */}
          <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-8 aspect-video flex flex-col items-center justify-center border-2 border-dashed border-slate-300">
            <div className="text-6xl mb-4">🏠</div>
            <p className="text-slate-600 font-medium text-center">
              Default Inspiration Image
            </p>
            <p className="text-sm text-slate-500 text-center mt-2">
              Warm minimal living room with beige tones, wood accents, and soft lighting
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Demo Note:</strong> For this demo, Snap2Room uses a default inspiration image. In production, you would be able to upload your own image or choose from a library.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleUseDefault}>
            Use Default Inspiration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
