import type { PlanGroup, Plan } from '@/types/plans.types';

/**
 * PlansService - Serviço puro para lógica de negócio de plantas
 * Todas as operações são funções puras, facilitando testes e manutenção
 */
export class PlansService {
  /**
   * Adiciona um novo grupo de plantas
   */
  static addGroup(groups: PlanGroup[], name: string): PlanGroup[] {
    return [
      ...groups,
      {
        id: Date.now().toString(),
        name: name.trim(),
        segments: [],
      },
    ];
  }

  /**
   * Remove um grupo de plantas
   */
  static deleteGroup(groups: PlanGroup[], groupId: string): PlanGroup[] {
    return groups.filter((g) => g.id !== groupId);
  }

  /**
   * Atualiza o nome de um grupo
   */
  static updateGroup(
    groups: PlanGroup[],
    groupId: string,
    name: string
  ): PlanGroup[] {
    return groups.map((g) =>
      g.id === groupId ? { ...g, name: name.trim() } : g
    );
  }

  /**
   * Adiciona uma nova planta a um grupo
   */
  static addPlan(
    groups: PlanGroup[],
    groupId: string,
    plan: Omit<Plan, 'id'>
  ): PlanGroup[] {
    return groups.map((g) =>
      g.id === groupId
        ? {
            ...g,
            segments: [
              ...(g.segments || []),
              { ...plan, id: Date.now().toString() } as Plan,
            ],
          }
        : g
    );
  }

  /**
   * Remove uma planta de um grupo
   */
  static deletePlan(
    groups: PlanGroup[],
    groupId: string,
    planId: string
  ): PlanGroup[] {
    return groups.map((g) =>
      g.id === groupId
        ? {
            ...g,
            segments: (g.segments || []).filter((s) => s.id !== planId),
          }
        : g
    );
  }

  /**
   * Duplica uma planta dentro do mesmo grupo
   */
  static duplicatePlan(
    groups: PlanGroup[],
    groupId: string,
    plan: Plan
  ): PlanGroup[] {
    return groups.map((g) =>
      g.id === groupId
        ? {
            ...g,
            segments: [
              ...(g.segments || []),
              {
                ...plan,
                id: Date.now().toString(),
                name: `${plan.name} (cópia)`,
              },
            ],
          }
        : g
    );
  }

  /**
   * Atualiza uma planta existente
   */
  static updatePlan(
    groups: PlanGroup[],
    groupId: string,
    planId: string,
    updates: Partial<Plan>
  ): PlanGroup[] {
    return groups.map((g) =>
      g.id === groupId
        ? {
            ...g,
            segments: (g.segments || []).map((s) =>
              s.id === planId ? { ...s, ...updates } : s
            ),
          }
        : g
    );
  }

  /**
   * Encontra um grupo por ID
   */
  static findGroup(
    groups: PlanGroup[],
    groupId: string
  ): PlanGroup | undefined {
    return groups.find((g) => g.id === groupId);
  }

  /**
   * Encontra uma planta por ID em todos os grupos
   */
  static findPlan(
    groups: PlanGroup[],
    planId: string
  ): { plan: Plan; groupId: string } | undefined {
    for (const group of groups) {
      const plan = group.segments?.find((s) => s.id === planId);
      if (plan) {
        return { plan, groupId: group.id };
      }
    }
    return undefined;
  }

  /**
   * Ordena grupos por nome
   */
  static sortGroups(groups: PlanGroup[]): PlanGroup[] {
    return [...groups].sort((a, b) => a.name.localeCompare(b.name));
  }
}
