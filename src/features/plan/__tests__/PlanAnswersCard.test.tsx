import { isValidElement, type ReactElement, type ReactNode } from 'react';

import { PlanAnswersCard, type PlanAnswersCardProps } from '@/features/plan/PlanAnswersCard';
import { buildPlanAnswersViewModel } from '@/hooks/usePlanAnswersViewModel';
import { createInitialDemoState, selectPlan } from '@/services/mock/demoState';

type Props = {
  children?: ReactNode;
  accessibilityLabel?: string;
  disabled?: boolean;
  onPress?: () => void;
};

// Walks the returned element tree without rendering, so child components stay unexpanded.
function findAll(node: ReactNode, match: (element: ReactElement<Props>) => boolean): ReactElement<Props>[] {
  if (Array.isArray(node)) {
    return node.flatMap((child) => findAll(child, match));
  }
  if (!isValidElement<Props>(node)) {
    return [];
  }
  return [...(match(node) ? [node] : []), ...findAll(node.props.children, match)];
}

function renderCard(editing: boolean) {
  const state = createInitialDemoState();
  const { lastPeriodStart, typicalBleedDays } = state.profile;
  const plan = { plan: selectPlan(state), lastPeriodStart, typicalBleedDays };
  const handlers = {
    toggleEditing: jest.fn(),
    decreaseLastPeriod: jest.fn(),
    increaseLastPeriod: jest.fn(),
    decreaseBleeding: jest.fn(),
    increaseBleeding: jest.fn(),
  };
  const props: PlanAnswersCardProps = {
    ...buildPlanAnswersViewModel({ profile: state.profile, plan, today: '2026-11-03', editing }),
    ...handlers,
  };
  const root = PlanAnswersCard(props);
  const byLabel = (label: string) => findAll(root, (element) => element.props.accessibilityLabel === label);
  return { handlers, byLabel };
}

describe('PlanAnswersCard', () => {
  it('shows Edit with no steppers until editing', () => {
    const { handlers, byLabel } = renderCard(false);
    const [edit] = byLabel('Edit');
    edit.props.onPress?.();
    expect(handlers.toggleEditing).toHaveBeenCalled();
    expect(byLabel('Decrease Last period started')).toHaveLength(0);
    expect(byLabel('Increase Typical bleeding')).toHaveLength(0);
  });

  it('shows Done and steppers for the last period date and typical bleeding while editing', () => {
    const { handlers, byLabel } = renderCard(true);
    expect(byLabel('Done')).toHaveLength(1);

    const [earlier] = byLabel('Decrease Last period started');
    const [later] = byLabel('Increase Last period started');
    expect(earlier.props.disabled).toBe(false);
    expect(later.props.disabled).toBe(true);
    earlier.props.onPress?.();
    expect(handlers.decreaseLastPeriod).toHaveBeenCalled();

    const [fewer] = byLabel('Decrease Typical bleeding');
    const [more] = byLabel('Increase Typical bleeding');
    fewer.props.onPress?.();
    more.props.onPress?.();
    expect(handlers.decreaseBleeding).toHaveBeenCalled();
    expect(handlers.increaseBleeding).toHaveBeenCalled();
  });
});
