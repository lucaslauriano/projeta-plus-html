'use client';

import React from 'react';
import { PlanItem } from '@/components/PlanItem';
import { GroupAccordion } from '@/app/dashboard/inteli-sket/components/group-accordion';
import {
  ScenesSkeleton,
  ScenesEmptyState,
  ScenesLoadingState,
} from '@/app/dashboard/inteli-sket/components/scenes-skeleton';
import type { PlanGroup, Plan } from '@/types/plans.types';

interface PlansContentProps {
  groups: PlanGroup[];
  isLoading: boolean;
  onEditGroup: (groupId: string) => void;
  onDeleteGroup: (groupId: string) => Promise<boolean>;
  onEditPlan: (plan: Plan) => void;
  onDeletePlan: (groupId: string, planId: string) => Promise<boolean>;
  onDuplicatePlan: (groupId: string, plan: Plan) => Promise<boolean>;
  onApplyPlan: (plan: Plan) => Promise<void>;
}

/**
 * Renderiza a lista de grupos e plantas
 * Componente puro, apenas apresentação
 */
export function PlansContent({
  groups,
  isLoading,
  onEditPlan,
  onEditGroup,
  onApplyPlan,
  onDeletePlan,
  onDeleteGroup,
  onDuplicatePlan,
}: PlansContentProps) {
  if (isLoading && groups.length === 0) return <ScenesLoadingState />;
  if (isLoading && groups.length > 0) return <ScenesSkeleton />;
  if (!isLoading && groups.length === 0) return <ScenesEmptyState />;

  return (
    <GroupAccordion
      groups={groups}
      onEditGroup={onEditGroup}
      onDeleteGroup={onDeleteGroup}
      emptyMessage='Nenhuma planta neste grupo'
      iconPosition='right'
      renderSegment={(segment, groupId) => (
        <PlanItem
          key={segment.id}
          title={segment.name}
          onEdit={() => onEditPlan(segment as Plan)}
          onLoadFromJson={() => onApplyPlan(segment as Plan)}
          onDuplicate={() => onDuplicatePlan(groupId, segment as Plan)}
          onDelete={() => onDeletePlan(groupId, segment.id)}
        />
      )}
    />
  );
}
