
export function getSegmentUrl() {
    return location.href.slice(location.origin.length + 1)
}