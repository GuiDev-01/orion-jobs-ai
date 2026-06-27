from fastapi import Header, HTTPException, status

from app import config


def require_admin_api_key(x_admin_api_key: str | None = Header(default=None)) -> None:
    """Protect operational endpoints when ADMIN_API_KEY is configured."""
    if not config.ADMIN_API_KEY:
        return

    if x_admin_api_key != config.ADMIN_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing admin API key",
        )
