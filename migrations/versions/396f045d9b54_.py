"""empty message

Revision ID: 396f045d9b54
Revises: 204c9028bd5e
Create Date: 2025-04-15 18:00:22.324383

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '396f045d9b54'
down_revision = '204c9028bd5e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('statuses',
    sa.Column('id', sa.Text(), nullable=False),
    sa.Column('name', sa.Text(), nullable=True),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_statuses'))
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('statuses')
    # ### end Alembic commands ###
