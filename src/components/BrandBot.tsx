import BloubBot from "../bloub/BloubBot";
import { makeBlock } from "../bloub/bot/cycles";
import type { StateId } from "../bloub/bot/states";

const LOGO_STATES: StateId[] = ["idle", "wink", "wide", "notify"];
const LOGO_CYCLE = LOGO_STATES.map((id) => makeBlock(id));

/** 顶栏 logo 旁的小型卵石表情 */
export default function BrandBot() {
  return (
    <span className="brand-bot" title="KG_DATA" aria-hidden="true">
      <BloubBot
        size={72}
        shape="galet"
        color="violet"
        paper="#f4f7ff"
        follow
        cycle={LOGO_CYCLE}
      />
    </span>
  );
}
