import { cn } from '@/lib/utils';
import type { Scene } from '@/types';
import { SHOT_TYPES } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Clock,
  Video,
  Type,
  Music,
  Image,
  GripVertical,
} from 'lucide-react';

interface SceneCardProps {
  scene: Scene;
  index: number;
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  className?: string;
}

export function SceneCard({
  scene,
  index,
  isSelected,
  onSelect,
  onEdit,
  className,
}: SceneCardProps) {
  const shotType = SHOT_TYPES.find((t) => t.value === scene.shot_type);

  return (
    <Card
      className={cn(
        'scene-card cursor-pointer transition-all',
        isSelected && 'ring-2 ring-accent border-accent',
        className
      )}
      onClick={onSelect}
      onDoubleClick={onEdit}
    >
      <CardHeader className="pb-2 pt-3 px-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
            <Badge variant="outline" className="text-xs">
              Scene {index + 1}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {scene.duration}s
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-3 pb-3 space-y-3">
        {/* Shot type and description */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Video className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium">{shotType?.label || scene.shot_type}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {scene.shot_description}
          </p>
        </div>

        {/* On-screen text */}
        {scene.on_screen_text && (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Type className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium">On-Screen</span>
            </div>
            <p className="text-sm font-semibold bg-primary text-primary-foreground px-2 py-1 rounded text-center">
              {scene.on_screen_text}
            </p>
          </div>
        )}

        {/* B-roll suggestions */}
        {scene.b_roll_suggestions.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Image className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium">B-Roll</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {scene.b_roll_suggestions.slice(0, 3).map((suggestion, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {suggestion}
                </Badge>
              ))}
              {scene.b_roll_suggestions.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{scene.b_roll_suggestions.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Audio notes */}
        {scene.audio_notes.music_mood && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Music className="h-3.5 w-3.5" />
            <span>{scene.audio_notes.music_mood}</span>
          </div>
        )}

        {/* Timeline indicator */}
        <div className="pt-2 border-t">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{scene.start_time}s</span>
            <span>{scene.end_time}s</span>
          </div>
          <div className="h-1 bg-muted rounded-full mt-1">
            <div
              className="h-full bg-accent rounded-full"
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
