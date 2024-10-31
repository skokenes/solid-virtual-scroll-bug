import { createSignal, For, type Component } from "solid-js";
import { createVirtualizer } from "@tanstack/solid-virtual";

const App: Component = () => {
  const [rowEstimate, setRowEstimate] = createSignal(28);

  let scrollEl!: HTMLDivElement;

  const virtualizer = createVirtualizer({
    count: 10,
    getScrollElement: () => scrollEl,
    estimateSize: () => rowEstimate(),

    // This also doesn't work, gives a different but still wrong scroll window:
    // estimateSize: () => 198
  });
  const items = virtualizer.getVirtualItems();

  return (
    <div
      ref={scrollEl}
      style={{
        // At 1000px, the scroll window calculates properly
        // "max-height": "1000px",

        // At 2000px, the scrolling does not show properly
        "max-height": "2000px",
        overflow: "auto",
        width: "100px",
        border: "1px solid black",
        margin: "48px",
      }}
    >
      {/* The large inner element to hold all of the items */}
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {/* Wrapper element that offsets via padding */}
        <div
          style={{
            height: "fit-content",
            width: "100%",
            "padding-top": `${items![0]?.start ?? 0}px`,
          }}
        >
          <For each={virtualizer.getVirtualItems()}>
            {(virtualItem) => (
              <div
                ref={(el) =>
                  queueMicrotask(() => {
                    virtualizer!.measureElement(el);
                    // Use first row size as estimate for all rows
                    if (virtualItem.index === 0) {
                      setRowEstimate(el.clientHeight);
                    }
                  })
                }
                style={{
                  height: "198px", // mock dynamic height
                  border: "1px solid red",
                }}
              >
                Row {virtualItem.index}
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};

export default App;
