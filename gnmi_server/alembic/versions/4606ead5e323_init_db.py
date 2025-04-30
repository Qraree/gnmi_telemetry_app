"""init_db

Revision ID: 4606ead5e323
Revises:
Create Date: 2025-04-30 02:58:29.512044

"""

from typing import Sequence, Union

import sqlmodel
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "4606ead5e323"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "device",
        sa.Column("short_id", sqlmodel.sql.sqltypes.AutoString(), nullable=True),
    )
    op.add_column(
        "device", sa.Column("image", sqlmodel.sql.sqltypes.AutoString(), nullable=True)
    )
    op.add_column(
        "device", sa.Column("state", sqlmodel.sql.sqltypes.AutoString(), nullable=True)
    )
    op.add_column(
        "device", sa.Column("status", sqlmodel.sql.sqltypes.AutoString(), nullable=True)
    )
    op.add_column(
        "device",
        sa.Column(
            "container_ipv4_address", sqlmodel.sql.sqltypes.AutoString(), nullable=True
        ),
    )
    op.add_column(
        "device",
        sa.Column(
            "container_ipv6_address", sqlmodel.sql.sqltypes.AutoString(), nullable=True
        ),
    )
    op.add_column(
        "device",
        sa.Column(
            "container_host_port", sqlmodel.sql.sqltypes.AutoString(), nullable=True
        ),
    )
    op.add_column(
        "device",
        sa.Column("container_port", sqlmodel.sql.sqltypes.AutoString(), nullable=True),
    )
    op.drop_index("ix_device_name", table_name="device")
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    op.create_index("ix_device_name", "device", ["name"], unique=False)
    op.drop_column("device", "container_port")
    op.drop_column("device", "container_host_port")
    op.drop_column("device", "container_ipv6_address")
    op.drop_column("device", "container_ipv4_address")
    op.drop_column("device", "status")
    op.drop_column("device", "state")
    op.drop_column("device", "image")
    op.drop_column("device", "short_id")
