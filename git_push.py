import subprocess
import sys

REPO_URL = "https://github.com/puspanDas/astrocoding.git"

def run(cmd_list):
    print(f">> {' '.join(cmd_list)}")
    result = subprocess.run(cmd_list, shell=False, capture_output=True, text=True)
    if result.stdout:
        print(result.stdout.strip())
    if result.returncode != 0 and result.stderr:
        print(result.stderr.strip())
    return result.returncode

def main():
    message = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else "Update AstroCode project"

    # Initialize git if needed
    run(["git", "init"])
    run(["git", "remote", "remove", "origin"])
    run(["git", "remote", "add", "origin", REPO_URL])
    run(["git", "add", "."])
    run(["git", "commit", "-m", message])
    run(["git", "branch", "-M", "main"])
    code = run(["git", "push", "-u", "origin", "main"])

    if code == 0:
        print("\n✅ Pushed successfully to", REPO_URL)
    else:
        print("\n⚠️  Push failed. Trying force push...")
        code = run(["git", "push", "-u", "origin", "main", "--force"])
        if code == 0:
            print("\n✅ Force pushed successfully to", REPO_URL)
        else:
            print("\n❌ Push failed. Check your credentials or repo access.")

if __name__ == "__main__":
    main()
