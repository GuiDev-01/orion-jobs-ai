"""Fix created_at default

Revision ID: d8c9801ef0dc
Revises: b540b629815b
Create Date: 2025-09-22 23:46:37.771380

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd8c9801ef0dc'
down_revision: Union[str, Sequence[str], None] = 'b540b629815b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.alter_column(
        'api_cache',
        'created_at',
        server_default=sa.func.now(),
        existing_type=sa.DateTime
    )

def downgrade():
    op.alter_column(
        'api_cache',
        'created_at',
        server_default=None,
        existing_type=sa.DateTime
    )
