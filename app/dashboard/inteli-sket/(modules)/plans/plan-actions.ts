import { ViewConfigSegment, ViewConfigGroup } from '@/types/global';

type PlanGroup = ViewConfigGroup;

export const planActions = {
  /**
   * Adiciona um novo grupo
   */
  addGroup: (groups: PlanGroup[], name: string): PlanGroup[] => {
    const newGroup: PlanGroup = {
      id: Date.now().toString(),
      name: name.trim(),
      segments: [],
    };
    return [...groups, newGroup];
  },

  /**
   * Remove um grupo
   */
  deleteGroup: (groups: PlanGroup[], groupId: string): PlanGroup[] => {
    return groups.filter((group) => group.id !== groupId);
  },

  /**
   * Renomeia um grupo
   */
  editGroup: (
    groups: PlanGroup[],
    groupId: string,
    newName: string
  ): PlanGroup[] => {
    return groups.map((g) =>
      g.id === groupId ? { ...g, name: newName.trim() } : g
    );
  },

  /**
   * Adiciona uma planta em um grupo específico ou cria novo grupo
   */
  addPlan: (
    groups: PlanGroup[],
    title: string,
    selectedGroup: string,
    currentState?: { style: string; cameraType: string; activeLayers: string[] }
  ): PlanGroup[] => {
    const newSegment: ViewConfigSegment = {
      id: Date.now().toString(),
      name: title.trim(),
      code: title.trim().toLowerCase().replace(/\s+/g, '_'),
      style: currentState?.style || 'PRO_PLANTAS',
      cameraType: currentState?.cameraType || 'topo_ortogonal',
      activeLayers: currentState?.activeLayers || [],
    };

    if (selectedGroup === 'root') {
      const newGroup: PlanGroup = {
        id: Date.now().toString(),
        name: title.trim(),
        segments: [newSegment],
      };
      return [...groups, newGroup];
    }

    return groups.map((group) => {
      if (group.id === selectedGroup) {
        return {
          ...group,
          segments: [...(group.segments || []), newSegment],
        };
      }
      return group;
    });
  },

  /**
   * Remove um segmento de um grupo
   */
  deletePlan: (
    groups: PlanGroup[],
    groupId: string,
    segmentId: string
  ): PlanGroup[] => {
    return groups.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          segments: (group.segments || []).filter(
            (segment) => segment.id !== segmentId
          ),
        };
      }
      return group;
    });
  },

  /**
   * Duplica uma planta dentro de um grupo
   */
  duplicatePlan: (
    groups: PlanGroup[],
    groupId: string,
    segment: ViewConfigSegment
  ): PlanGroup[] => {
    return groups.map((g) => {
      if (g.id === groupId) {
        return {
          ...g,
          segments: [
            ...(g.segments || []),
            {
              ...segment,
              id: Date.now().toString(),
              name: `${segment.name} (cópia)`,
            },
          ],
        };
      }
      return g;
    });
  },

  /**
   * Atualiza o nome de uma planta em todos os grupos
   */
  updatePlanName: (
    groups: PlanGroup[],
    planId: string,
    newName: string
  ): PlanGroup[] => {
    return groups.map((g) => ({
      ...g,
      segments: (g.segments || []).map((s) =>
        s.id === planId ? { ...s, name: newName.trim() } : s
      ),
    }));
  },

  /**
   * Ordena grupos alfabeticamente
   */
  sortGroups: (groups: PlanGroup[]): PlanGroup[] => {
    return [...groups].sort((a, b) => a.name.localeCompare(b.name));
  },

  /**
   * Busca um grupo por ID
   */
  findGroup: (groups: PlanGroup[], groupId: string): PlanGroup | undefined => {
    return groups.find((g) => g.id === groupId);
  },
};
