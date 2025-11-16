# npm Trusted Publishing Setup with OIDC

## What is Trusted Publishing?

Trusted publishing uses OpenID Connect (OIDC) to authenticate GitHub Actions workflows directly with npm, eliminating the need for long-lived NPM tokens. This is more secure because:

- No tokens to manage or rotate (they were recently limited to 90 days max)
- Credentials are short-lived and workflow-specific
- Automatic provenance attestations included
- Cryptographic trust prevents token exfiltration

## Initial Publish Requirement

**IMPORTANT**: npm does not support OIDC for initial package publishes. The package must exist on npm before you can configure trusted publishing.

### Strategy for First Publish

1. Create a Granular Access Token (temporary)
2. Add as NPM_TOKEN secret in GitHub
3. Publish first version via workflow (uses token)
4. Configure trusted publishing on npmjs.com
5. Optionally remove token secret (OIDC takes over)

The workflow supports both methods - it will use OIDC if configured, otherwise falls back to NPM_TOKEN.

## Manual Configuration Required (After Initial Publish)

For each package you want to publish, you need to configure trusted publishing on npmjs.com:

### Step 1: Navigate to Package Settings

1. Go to <https://www.npmjs.com/>
2. Navigate to your package: `@mdxeditor/source-preview-plugin`
3. Click on **"Settings"** tab

### Step 2: Configure Trusted Publisher

1. Scroll to **"Trusted Publisher"** section
2. Click **"Add trusted publisher"**
3. Select **"GitHub Actions"** as the provider

### Step 3: Enter Workflow Details

Fill in the following fields EXACTLY:

- **Organization/User**: Your GitHub username or org (e.g., `your-username`)
- **Repository**: `mdx-editor` (or whatever your repo name is)
- **Workflow filename**: `release.yml` (MUST match exactly, case-sensitive)
- **Environment name**: Leave blank (optional, we don't use environments)

### Step 4: Save Configuration

Click **"Add"** to save the trusted publisher configuration.

## Verification

After configuration:

1. The workflow will authenticate automatically via OIDC
2. NPM_TOKEN can be removed from GitHub secrets (optional - keeping it as fallback is fine)
3. Subsequent publishes will use OIDC and create provenance attestations
4. Check workflow logs to verify OIDC authentication succeeds

## Important Notes

- **Self-hosted runners NOT supported** - Use GitHub-hosted runners only
- **One publisher per package** - Can't have multiple trusted publishers currently
- **Workflow filename must match exactly** - Including `.yml` extension
- **Case sensitive** - All fields are case-sensitive

## What Changed in the Codebase

1. Added `id-token: write` permission to workflow (.github/workflows/release.yml:17)
2. Removed NPM_TOKEN from workflow environment variables
3. Added `--provenance` flag to publish command (package.json:16)
4. Added explicit permissions block to workflow

## Rollback Plan

If trusted publishing doesn't work, you can:

1. Remove trusted publisher from npmjs.com
2. Create a Granular Access Token
3. Add it as NPM_TOKEN secret in GitHub
4. Restore `NPM_TOKEN: ${{ secrets.NPM_TOKEN }}` in workflow
