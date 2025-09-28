import os
import json

# Base media folders
MEDIA_DIR = "media"
GROUPS = ["plans", "sections", "site-plans", "diagrams"]

# Output file
OUT_FILE = "data/manifest.json"

def collect_images(base_dir):
    """Collect and sort image file paths in a folder."""
    if not os.path.exists(base_dir):
        return []
    return sorted([
        os.path.join(base_dir, f).replace("\\", "/")
        for f in os.listdir(base_dir)
        if f.lower().endswith((".jpg", ".jpeg", ".png"))
    ])

def build_manifest():
    manifest = {}
    for group in GROUPS:
        high_dir = os.path.join(MEDIA_DIR, group)
        low_dir = os.path.join(MEDIA_DIR, group + "_low")

        manifest[group] = {
            "high": collect_images(high_dir),
            "low": collect_images(low_dir)
        }

    return manifest

if __name__ == "__main__":
    manifest = build_manifest()

    os.makedirs(os.path.dirname(OUT_FILE), exist_ok=True)
    with open(OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    print(f"✅ Manifest written to {OUT_FILE}")
