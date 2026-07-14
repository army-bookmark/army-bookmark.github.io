# GA4 event reference

GA4 property: `G-1BTFQD5SL4`. Events are defined in `src/lib/analytics.ts` and fired from
`AppClient.tsx`, `DetailView.tsx`, `DetailItem.tsx`.

This is an SPA — clicking into a section never changes the URL, so GA4's automatic
pageview can't tell sections apart on its own. These custom events exist to fix that.

| Event name | Fires when | Key params |
|---|---|---|
| `section_entry_click` | User clicks a button/card that opens a section | `section_id`, `section_name`, `entry_point` (`card_thumbnail` / `see_more_button` / `bar_button`) |
| `section_view` | A section's detail view mounts | `section_id`, `section_name` |
| `section_engagement` | User clicks back out of a section | `section_id`, `engagement_time_sec` (dwell time) |
| `section_toggle` | Collapse/expand on the archived sections (Persiapan Cari Tiket, War Tiket) | `section_id`, `expanded` |
| `link_click` | Any outbound link (source post, donation) | `link_url`, `section_id`, `link_type` (`source_post` / `donation`) |
| `scroll_depth` | 25/50/75/100% scroll crossed | `percent_scrolled`, `section_id` |
| `page_view` (virtual) | Fires alongside `section_view` | `page_path` (e.g. `/section/persiapan-tiket`), `page_title` |

## Reading this in GA4

**Section-to-section flow (Explore → Path Exploration):** don't use "Event name" as the
node type — everything piles up under generic `page_view`/`click`/`scroll` from GA4's
automatic tracking. Switch the node type to **"Page path and screen class"** instead; the
virtual `page_view` events give each section its own named node.

**Click-level detail:** keep "Event name" as the node type, but set the starting point to
one of the custom event names above (e.g. `section_entry_click` or `link_click`) instead
of leaving it blank — otherwise the graph is dominated by `session_start`/`scroll`/`click`
noise from GA4's automatic Enhanced Measurement events.
