"""Add video chunks table

Revision ID: 001_add_video_chunks
Revises: 
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001_add_video_chunks'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create video_chunks table
    op.create_table('video_chunks',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('video_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('chunk_index', sa.Integer(), nullable=False),
        sa.Column('filename', sa.String(length=255), nullable=False),
        sa.Column('start_time', sa.Float(), nullable=False),
        sa.Column('end_time', sa.Float(), nullable=False),
        sa.Column('duration', sa.Float(), nullable=False),
        sa.Column('size', sa.Integer(), nullable=False),
        sa.Column('fps', sa.Float(), nullable=True),
        sa.Column('width', sa.Integer(), nullable=True),
        sa.Column('height', sa.Integer(), nullable=True),
        sa.Column('isActive', sa.Boolean(), nullable=True),
        sa.Column('createdAt', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updatedAt', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['video_id'], ['videos.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create index on video_id for better performance
    op.create_index('ix_video_chunks_video_id', 'video_chunks', ['video_id'])
    op.create_index('ix_video_chunks_chunk_index', 'video_chunks', ['video_id', 'chunk_index'])


def downgrade():
    # Drop indexes
    op.drop_index('ix_video_chunks_chunk_index', table_name='video_chunks')
    op.drop_index('ix_video_chunks_video_id', table_name='video_chunks')
    
    # Drop table
    op.drop_table('video_chunks')
