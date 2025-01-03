/* eslint-disable unicorn/no-null */
'use client';

import { Check, Clipboard, PlusCircle } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

import AudioCaptionPlayer, {
  Caption,
  EditTools,
} from '../audio-caption-player';
import AddCaptionForm from './add-caption-form';

interface CaptionListProps {
  initial_captions: Caption[];
}

export default function EditCaptionsList({
  initial_captions,
}: CaptionListProps) {
  const [captions, setCaptions] = useState<Caption[]>(initial_captions);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [captionToDuplicate, setCaptionToDuplicate] = useState<Caption | null>(
    null,
  );

  const sortCaptions = useCallback((captionsToSort: Caption[]): Caption[] => {
    return [...captionsToSort]
      .sort((a, b) => a.startTime - b.startTime)
      .map((caption, index) => ({
        ...caption,
        id: index + 1,
      }));
  }, []);

  const deleteCaption = useCallback((id: number) => {
    setCaptions(previousCaptions =>
      previousCaptions.filter(caption => caption.id !== id),
    );
  }, []);

  const duplicateCaption = useCallback(
    (id: number) => {
      const cardToDuplicate = captions.find(caption => caption.id === id);
      if (cardToDuplicate) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setCaptionToDuplicate({ ...cardToDuplicate, id: captions.length + 1 });
        setShowAddForm(true);
      }
    },
    [captions],
  );

  const addCaption = useCallback(
    (newCaption: Omit<Caption, 'id'>) => {
      const captionWithId: Caption = { ...newCaption, id: captions.length };
      setCaptions(previousCaptions =>
        sortCaptions([...previousCaptions, captionWithId]),
      );
      setShowAddForm(false);
      setCaptionToDuplicate(null);
    },
    [sortCaptions],
  );

  const copyToClipboard = useCallback(() => {
    const captionListJson = JSON.stringify(captions, null, 2);

    navigator.clipboard
      .writeText(captionListJson)
      .then(() => {
        setIsCopied(true);
        toast({
          title: 'Copied to clipboard',
          description:
            'The JSON list of captions has been copied to your clipboard.',
        });
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(error => {
        console.error('Failed to copy:', error);
        toast({
          title: 'Failed to copy',
          description:
            'There was an error copying the JSON list to your clipboard.',
          variant: 'destructive',
        });
      });
  }, [captions]);

  const editTools: EditTools = {
    deleteCaption,
    insertAfterCaption: duplicateCaption,
  };
  return (
    <>
      <AudioCaptionPlayer captions={captions} editTools={editTools} />
      <div className="flex flex-col items-center space-y-4 p-4">
        {showAddForm ? (
          <AddCaptionForm
            onAddCaption={addCaption}
            onCancel={() => {
              setShowAddForm(false);
              setCaptionToDuplicate(null);
            }}
            existingCaptions={captions}
            captionToDuplicate={captionToDuplicate}
          />
        ) : (
          <>
            <Button
              onClick={() => setShowAddForm(true)}
              className="mt-4 cursor-pointer text-white hover:text-label"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Caption
            </Button>

            <Button
              variant="link"
              onClick={copyToClipboard}
              className="mt-4 cursor-pointer text-white hover:text-label"
            >
              {isCopied ? (
                <Check className="mr-2 h-4 w-4" />
              ) : (
                <Clipboard className="mr-2 h-4 w-4" />
              )}
              {isCopied ? 'Copied!' : 'Copy captions to Clipboard'}
            </Button>
          </>
        )}
      </div>
    </>
  );
}
