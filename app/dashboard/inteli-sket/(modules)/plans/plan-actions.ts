type PlanGroup = {
  id: string;
  name: string;
  plans: Plan[];
};

type Plan = {
  id: string;
  title: string;
  segments: Array<{ id: string; name: string }>;
};

export const planActions = {
  /**
   * Adiciona um novo grupo
   */
  addGroup: (groups: PlanGroup[], name: string): PlanGroup[] => {
    const newGroup: PlanGroup = {
      id: Date.now().toString(),
      name: name.trim(),
      plans: [],
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
    selectedGroup: string
  ): PlanGroup[] => {
    const newPlan: Plan = {
      id: Date.now().toString(),
      title: title.trim(),
      segments: [],
    };

    if (selectedGroup === 'root') {
      const newGroup: PlanGroup = {
        id: Date.now().toString(),
        name: title.trim(),
        plans: [],
      };
      return [...groups, newGroup];
    }

    return groups.map((group) => {
      if (group.id === selectedGroup) {
        return {
          ...group,
          plans: [...group.plans, newPlan],
        };
      }
      return group;
    });
  },

  /**
   * Remove uma planta de um grupo
   */
  deletePlan: (
    groups: PlanGroup[],
    groupId: string,
    planId: string
  ): PlanGroup[] => {
    return groups.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          plans: group.plans.filter((plan) => plan.id !== planId),
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
    plan: Plan
  ): PlanGroup[] => {
    return groups.map((g) => {
      if (g.id === groupId) {
        return {
          ...g,
          plans: [
            ...g.plans,
            {
              id: Date.now().toString(),
              title: `${plan.title} (cópia)`,
              segments: [...plan.segments],
            },
          ],
        };
      }
      return g;
    });
  },

  /**
   * Atualiza o título de uma planta em todos os grupos
   */
  updatePlanTitle: (
    groups: PlanGroup[],
    planId: string,
    newTitle: string
  ): PlanGroup[] => {
    return groups.map((g) => ({
      ...g,
      plans: g.plans.map((p) =>
        p.id === planId ? { ...p, title: newTitle.trim() } : p
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
