export function hasSelected() {
    return !!getSelection()!.rangeCount && !getSelection()!.isCollapsed
}