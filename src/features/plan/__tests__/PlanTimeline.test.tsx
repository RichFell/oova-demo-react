import type { ReactElement } from 'react';
import type { PressableProps } from 'react-native';

import { PlanTimeline } from '@/features/plan/PlanTimeline';
import { buildPlanViewModel } from '@/hooks/usePlanViewModel';
import { createInitialDemoState, selectPlan } from '@/state/demoState';

type Element = ReactElement<{ children?: unknown }>;

function dayButtons(onSelectDay = jest.fn(), selectedDate = '2026-11-03') {
  const { days, showPeriodLegend } = buildPlanViewModel(selectPlan(createInitialDemoState()), selectedDate);
  const root = PlanTimeline({ days, showPeriodLegend, onSelectDay }) as Element;
  const [scroll] = root.props.children as Element[];
  return scroll.props.children as ReactElement<PressableProps>[];
}

describe('PlanTimeline', () => {
  it('renders a button for every plan day with an accessible selected state', () => {
    const buttons = dayButtons(jest.fn(), '2026-11-05');
    expect(buttons).toHaveLength(30);
    buttons.forEach((button) => expect(button.props.accessibilityRole).toBe('button'));
    expect(buttons.map((button) => button.props.accessibilityState?.selected)).toEqual(
      buttons.map((_, index) => index === 2),
    );
  });

  it('reports the pressed day', () => {
    const onSelectDay = jest.fn();
    dayButtons(onSelectDay)[4].props.onPress?.({} as never);
    expect(onSelectDay).toHaveBeenCalledWith('2026-11-07');
  });
});
